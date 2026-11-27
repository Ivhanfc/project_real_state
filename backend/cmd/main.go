package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	propertyv1 "project_real_state/contracts/gen/property/v1"
	"project_real_state/controllers"
	"project_real_state/external/mysql"
	propertymethods "project_real_state/external/mysql/property_methods"
	"time"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)




func main() {
	grpcServer := grpc.NewServer()
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on system environment variables")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	DBConn, err := mysql.ConnectionDB(ctx)
	if err != nil {
		log.Fatalf("failed to connect db: %v", err)
	}

	defer DBConn.Close()

	propertyRepo := propertymethods.NewPropertyAdapter(DBConn)
	propertyHandler := controllers.NewPropertyHandler(propertyRepo)

	
	propertyv1.RegisterPropertyServiceServer(grpcServer, propertyHandler)
	reflection.Register(grpcServer)

	go func()  {
		lis, err := net.Listen("tcp", ":50051")
		if err != nil {
			log.Fatalf("failed to Listen %v \n", err.Error())
			return
		}
		fmt.Printf("Native gRPC server listen at %v \n", lis.Addr())
		if err := grpcServer.Serve(lis); err != nil {
			log.Fatalf("Failed to serve gRPC: %v \n", err.Error())
		}

		}()

		wrappedGrpc := grpcweb.WrapServer(grpcServer,
		grpcweb.WithOriginFunc(func(origin string) bool {return true}),
		grpcweb.WithAllowedRequestHeaders([]string{"*"}),
	)
	
	httpServer := &http.Server{
		Addr: ":8080",
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if wrappedGrpc.IsGrpcWebRequest(r) || wrappedGrpc.IsAcceptableGrpcCorsRequest(r) {
				wrappedGrpc.ServeHTTP(w,r)
				return
			}
			http.NotFound(w,r)
		}),
	}
	log.Println("server listen at :8080")
	if err := httpServer.ListenAndServe(); err != nil {
		log.Fatalf("Failed to serve %v \n ", err.Error())
	}
}



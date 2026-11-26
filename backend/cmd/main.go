package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	propertyv1 "project_real_state/contracts/gen/property/v1"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)


type Server struct {
	propertyv1.UnimplementedPropertyServiceServer
	Mux *http.ServeMux
}



func main() {
	grpcServer := grpc.NewServer()

	propertyv1.RegisterPropertyServiceServer(grpcServer,&Server{Mux: nil, })
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



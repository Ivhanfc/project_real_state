package mysql

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectionDB(ctx context.Context)(*sql.DB, error) {
	cfg := mysql.NewConfig()
	cfg.User = os.Getenv("DB_USER")
	cfg.Passwd = os.Getenv("DB_PASSWORD")
	cfg.Net = "tcp"
	cfg.Addr = "127.0.0.1:3306"
	cfg.DBName = "realstate"

	 var err error
	DB , err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatalf("Error in create connection with mysql: ,%w \n",err)
	}

	if err := DB.PingContext(ctx); err != nil {
		log.Fatalf("Error pinging db :%w \n", err)
	}
	fmt.Println("Database connection succesful!!")
	return DB, nil
}
package main

import "sync"


type Server struct {
	Mu sync.Mutex
	jobs chan []Property
	
}



func main() {

}


func initWorker() (error) {

}
func worker() (error) {

}
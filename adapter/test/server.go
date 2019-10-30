package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/path", HelloServer)
	http.ListenAndServe(":8081", nil)
}

func HelloServer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("jea je to tu")
	fmt.Fprintf(w, "Hello, %s!", r.URL.Path[1:])
}

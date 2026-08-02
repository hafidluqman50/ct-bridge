package main

import (
	"log"

	"github.com/hafidluqman/ct-bridge/backend/src/app"
)

func main() {
	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}

package main

import (
	"app-plate/kohinigeee/sublib"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	engin := gin.Default()
	engin.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "hello world",
		})
	})

	sublib.TestFunc()
	engin.Run(":3000")

}

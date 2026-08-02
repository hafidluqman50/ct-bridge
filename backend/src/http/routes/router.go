package routes

import (
	"github.com/gin-gonic/gin"

	handlers "github.com/hafidluqman/ct-bridge/backend/src/http/handlers"
	analyticsHandler "github.com/hafidluqman/ct-bridge/backend/src/http/handlers/analytics"
	autogradHandler "github.com/hafidluqman/ct-bridge/backend/src/http/handlers/autograd"
	codegenHandler "github.com/hafidluqman/ct-bridge/backend/src/http/handlers/codegen"
	followupHandler "github.com/hafidluqman/ct-bridge/backend/src/http/handlers/followup"
	gradingHandler "github.com/hafidluqman/ct-bridge/backend/src/http/handlers/grading"
	"github.com/hafidluqman/ct-bridge/backend/src/http/middleware"
	analyticsRoutes "github.com/hafidluqman/ct-bridge/backend/src/http/routes/analytics"
	autogradRoutes "github.com/hafidluqman/ct-bridge/backend/src/http/routes/autograd"
	codegenRoutes "github.com/hafidluqman/ct-bridge/backend/src/http/routes/codegen"
	followupRoutes "github.com/hafidluqman/ct-bridge/backend/src/http/routes/followup"
	gradingRoutes "github.com/hafidluqman/ct-bridge/backend/src/http/routes/grading"
	"github.com/hafidluqman/ct-bridge/backend/src/service"
)

// SetupRouter builds the gin engine and mounts every route group.
//
// Every feature below hangs off ONE flowchart submission
// (/api/v1/gradings/:id/...): grade it, generate code from it, check a
// student's own code against it, ask for a remedial plan, or draft a parent
// message — one pipeline, not disconnected tools.
func SetupRouter(services service.Registry) *gin.Engine {
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(gin.Logger())
	router.Use(middleware.CORS())
	router.MaxMultipartMemory = 20 << 20 // 20 MB image upload

	healthHandler := &handlers.HealthHandler{}
	router.GET("/healthz", healthHandler.Healthz)

	api := router.Group("/api/v1")

	gradingsGroup := api.Group("/gradings")
	gradingRoutes.RegisterRoutes(gradingsGroup, gradingHandler.NewHandler(gradingHandler.Dependencies{Service: services.Grading}))
	followupRoutes.RegisterRoutes(gradingsGroup, followupHandler.NewHandler(followupHandler.Dependencies{Service: services.FollowUp}))
	codegenRoutes.RegisterRoutes(gradingsGroup, codegenHandler.NewHandler(codegenHandler.Dependencies{Service: services.Codegen}))
	autogradRoutes.RegisterRoutes(gradingsGroup, autogradHandler.NewHandler(autogradHandler.Dependencies{Service: services.AutoGrad}))

	analyticsRoutes.RegisterRoutes(
		api.Group("/class-queries"),
		analyticsHandler.NewHandler(analyticsHandler.Dependencies{Service: services.Analytics}),
	)

	return router
}

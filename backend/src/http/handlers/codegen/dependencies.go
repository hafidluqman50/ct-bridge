package codegen

import "github.com/hafidluqman/ct-bridge/backend/src/service/codegen"

// Dependencies holds everything the codegen handlers need, injected once at
// bootstrap.
type Dependencies struct {
	Service *codegen.CodegenService
}

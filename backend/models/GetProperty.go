package services

import (
	"context"

	propertyv1 "project_real_state/contracts/gen/property/v1"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *PropertyServer) GetProperty(
	ctx context.Context,
	req *propertyv1.GetPropertyRequest,
) (*propertyv1.GetPropertyResponse, error) {
	if req == nil || req.GetId() == 0 {
		return nil, status.Error(codes.InvalidArgument, "el id de la propiedad es obligatorio")
	}

	prop, err := s.repo.GetByID(ctx, uint(req.GetId()))
	if err != nil {
		return nil, status.Errorf(codes.Internal, "error al obtener propiedad: %v", err)
	}
	if prop == nil {
		return nil, status.Error(codes.NotFound, "propiedad no encontrada")
	}

	return &propertyv1.GetPropertyResponse{
		Property: toProtoProperty(prop),
	}, nil
}
package services

import (
	"context"
	"errors"
	"fmt"

	propertyv1 "project_real_state/contracts/gen/property/v1"
	"project_real_state/models"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

var (
	ErrPropertyNotFound = errors.New("propiedad no encontrada")
	ErrForbidden       = errors.New("no tienes permiso para eliminar esta propiedad")
)

type PropertyRepository interface {
	GetByID(ctx context.Context, id uint) (*models.Property, error)
	Delete(ctx context.Context, id uint) error
}

type PropertyServer struct {
	propertyv1.UnimplementedPropertyServiceServer
	repo PropertyRepository
}

func NewPropertyServer(repo PropertyRepository) *PropertyServer {
	return &PropertyServer{repo: repo}
}

func (s *PropertyServer) DeleteProperty(
	ctx context.Context,
	req *propertyv1.GetPropertyRequest,
) (*wrapperspb.BoolValue, error) {
	if req == nil || req.GetId() == 0 {
		return nil, status.Error(codes.InvalidArgument, "el id de la propiedad es obligatorio")
	}

	requesterAgentID, ok := ctx.Value("agentID").(uint)
	if !ok || requesterAgentID == 0 {
		return nil, status.Error(codes.Unauthenticated, "no autorizado")
	}

	propertyID := uint(req.GetId())

	prop, err := s.repo.GetByID(ctx, propertyID)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "error al consultar propiedad: %v", err)
	}
	if prop == nil {
		return nil, status.Error(codes.NotFound, ErrPropertyNotFound.Error())
	}
	if prop.AgentID != requesterAgentID {
		return nil, status.Error(codes.PermissionDenied, ErrForbidden.Error())
	}

	if err := s.repo.Delete(ctx, propertyID); err != nil {
		return nil, status.Errorf(codes.Internal, "%s", fmt.Errorf("eliminar propiedad %d: %w", propertyID, err))
	}

	return wrapperspb.Bool(true), nil
}
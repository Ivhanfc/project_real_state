package controllers

import (
	"context"
	"errors"
	"fmt"
	"strconv"

	propertyv1 "project_real_state/contracts/gen/property/v1"
	models "project_real_state/models/property"
	"project_real_state/repository"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

var (
	ErrPropertyNotFound = errors.New("property not found")
	ErrForbidden        = errors.New("you don't have permission to modify or delete this property")
)

type PropertyHandler struct {
	propertyv1.UnimplementedPropertyServiceServer
	repo repository.PropertyRepository
}

func NewPropertyHandler(repo repository.PropertyRepository) *PropertyHandler {
	return &PropertyHandler{
		repo: repo,
	}
}

// 1. ADD PROPERTY
func (h *PropertyHandler) AddProperty(
	ctx context.Context,
	req *propertyv1.AddPropertyRequest,
) (*propertyv1.AddPropertyResponse, error) {
	if req == nil || req.GetProperty() == nil {
		return nil, status.Error(codes.InvalidArgument, "property data is required")
	}

	agentID, ok := ctx.Value("agentID").(uint)
	if !ok || agentID == 0 {
		return nil, status.Error(codes.Unauthenticated, "not authorized")
	}

	pbProp := req.GetProperty()

	prop := models.Property{
		AgentID:     agentID, 
		Name:        pbProp.GetName(),
		Description: pbProp.GetDescription(),
		Address:     pbProp.GetAddress(),
		PriceCents:  pbProp.GetPriceCents(),
		Zone:        pbProp.GetZone(),
		Currency:    pbProp.GetCurrency(),
		IsAvailable: pbProp.GetIsAvailable(),
		SizeM2:      pbProp.GetSizeM2(),
	}

	newID, err := h.repo.Add(ctx, prop)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "error creating property: %v", err)
	}

	prop.ID = newID

	return &propertyv1.AddPropertyResponse{
		Property: toProtoProperty(&prop),
	}, nil
}

// 2. GET PROPERTY
func (h *PropertyHandler) GetProperty(
	ctx context.Context,
	req *propertyv1.GetPropertyRequest,
) (*propertyv1.GetPropertyResponse, error) {
	if req == nil || req.GetId() == 0 {
		return nil, status.Error(codes.InvalidArgument, "property id is required")
	}

	prop, err := h.repo.GetByID(ctx, uint(req.GetId()))
	if err != nil {
		return nil, status.Errorf(codes.Internal, "error querying property: %v", err)
	}
	if prop == nil {
		return nil, status.Error(codes.NotFound, ErrPropertyNotFound.Error())
	}

	return &propertyv1.GetPropertyResponse{
		Property: toProtoProperty(prop),
	}, nil
}

// 3. UPDATE PROPERTY
func (h *PropertyHandler) UpdateProperty(
	ctx context.Context,
	req *propertyv1.UpdatePropertyRequest,
) (*propertyv1.UpdatePropertyResponse, error) {
	if req == nil || req.GetProperty() == nil || req.GetProperty().GetId() == 0 {
		return nil, status.Error(codes.InvalidArgument, "property and valid id are required")
	}

	requesterAgentID, ok := ctx.Value("agentID").(uint)
	if !ok || requesterAgentID == 0 {
		return nil, status.Error(codes.Unauthenticated, "not authorized")
	}

	pbProp := req.GetProperty()
	propertyID := uint(pbProp.GetId())

	existing, err := h.repo.GetByID(ctx, propertyID)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "error querying property: %v", err)
	}
	if existing == nil {
		return nil, status.Error(codes.NotFound, ErrPropertyNotFound.Error())
	}
	if existing.AgentID != requesterAgentID {
		return nil, status.Error(codes.PermissionDenied, ErrForbidden.Error())
	}

	updated := models.Property{
		ID:          propertyID,
		AgentID:     existing.AgentID,
		Name:        pbProp.GetName(),
		Description: pbProp.GetDescription(),
		Address:     pbProp.GetAddress(),
		PriceCents:  pbProp.GetPriceCents(),
	}

	if err := h.repo.Update(ctx, updated); err != nil {
		return nil, status.Errorf(codes.Internal, "error updating property: %v", err)
	}

	return &propertyv1.UpdatePropertyResponse{
		Property: toProtoProperty(&updated),
	}, nil
}

// 4. DELETE PROPERTY
func (h *PropertyHandler) DeleteProperty(
	ctx context.Context,
	req *propertyv1.GetPropertyRequest,
) (*wrapperspb.BoolValue, error) {
	if req == nil || req.GetId() == 0 {
		return nil, status.Error(codes.InvalidArgument, "property id is required")
	}

	requesterAgentID, ok := ctx.Value("agentID").(uint)
	if !ok || requesterAgentID == 0 {
		return nil, status.Error(codes.Unauthenticated, "not authorized")
	}

	propertyID := uint(req.GetId())

	prop, err := h.repo.GetByID(ctx, propertyID)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "error querying property: %v", err)
	}
	if prop == nil {
		return nil, status.Error(codes.NotFound, ErrPropertyNotFound.Error())
	}
	if prop.AgentID != requesterAgentID {
		return nil, status.Error(codes.PermissionDenied, ErrForbidden.Error())
	}

	if err := h.repo.Delete(ctx, propertyID); err != nil {
		return nil, status.Errorf(codes.Internal, "%s", fmt.Errorf("delete property %d: %w", propertyID, err))
	}

	return wrapperspb.Bool(true), nil
}

// Helper para convertir tu modelo de dominio a mensaje Protobuf
func toProtoProperty(p *models.Property) *propertyv1.Property {
	return &propertyv1.Property{
		Id:          uint64(p.ID),
		AgentID:     strconv.FormatUint(uint64(p.AgentID), 10),
		Name:        p.Name,
		Description: p.Description,
		Address:     p.Address,
		PriceCents:  p.PriceCents,
		// Zone:        p.Zone,
		// Currency:    p.Currency,
		// IsAvailable: p.IsAvailable,
		// SizeM2:      p.SizeM2,
	}
}
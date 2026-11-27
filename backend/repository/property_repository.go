package repository

import (
	"context"
	models "project_real_state/models/property"
)

type PropertyRepository interface {
	Add(ctx context.Context, prop models.Property) (uint, error)
	GetByID(ctx context.Context, id uint) (*models.Property, error)
	GetAll(ctx context.Context) ([]models.Property, error)
	Update(ctx context.Context, prop models.Property) error
	Delete(ctx context.Context, id uint) error
}
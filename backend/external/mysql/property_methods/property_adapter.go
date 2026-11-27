package propertymethods

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	models "project_real_state/models/property"
	"project_real_state/repository"
)

var _ repository.PropertyRepository = (*PropertyAdapter)(nil)

type PropertyAdapter struct {
	database *sql.DB
}

func NewPropertyAdapter(db *sql.DB) *PropertyAdapter {
	return &PropertyAdapter{database: db}
}

func (p *PropertyAdapter) Add(ctx context.Context, prop models.Property) (uint, error) {
	query := `INSERT INTO properties (name, description, price_cents, address, agent_id) VALUES (?, ?, ?, ?, ?)`
	res, err := p.database.ExecContext(ctx, query, prop.Name, prop.Description, prop.PriceCents, prop.Address, prop.AgentID)
	if err != nil {
		return 0, fmt.Errorf("error inserting property: %w", err)
	}
	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}
	return uint(id), nil
}

func (p *PropertyAdapter) GetByID(ctx context.Context, id uint) (*models.Property, error) {
	query := `SELECT id, name, description, price_cents, address, agent_id FROM properties WHERE id = ?`

	var prop models.Property
	err := p.database.QueryRowContext(ctx, query, id).Scan(
		&prop.ID,
		&prop.Name,
		&prop.Description,
		&prop.PriceCents,
		&prop.Address,
		&prop.AgentID,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("error querying property: %w", err)
	}

	return &prop, nil
}

func (p *PropertyAdapter) GetAll(ctx context.Context) ([]models.Property, error) {
	query := `SELECT id, name, description, price_cents, address, agent_id FROM properties`
	rows, err := p.database.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var properties []models.Property
	for rows.Next() {
		var prop models.Property
		if err := rows.Scan(&prop.ID, &prop.Name, &prop.Description, &prop.PriceCents, &prop.Address, &prop.AgentID); err != nil {
			return nil, err
		}
		properties = append(properties, prop)
	}
	return properties, rows.Err()
}

func (p *PropertyAdapter) Update(ctx context.Context, prop models.Property) error {
	query := `UPDATE properties SET name = ?, description = ?, price_cents = ?, address = ? WHERE id = ?`
	res, err := p.database.ExecContext(ctx, query, prop.Name, prop.Description, prop.PriceCents, prop.Address, prop.ID)
	if err != nil {
		return err
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("no property found with id %d", prop.ID)
	}
	return nil
}

func (p *PropertyAdapter) Delete(ctx context.Context, id uint) error {
	query := `DELETE FROM properties WHERE id = ?`
	res, err := p.database.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("error deleting property: %w", err)
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("no property found with id %d", id)
	}
	return nil
}
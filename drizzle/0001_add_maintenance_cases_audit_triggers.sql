-- Add audit triggers for maintenance_cases
CREATE OR REPLACE FUNCTION log_maintenance_cases_changes() RETURNS trigger AS $$
DECLARE
  actor text := current_setting('app.current_user', true);
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
    VALUES ('maintenance_cases', NEW.id, 'row_created', NULL, to_jsonb(NEW), actor);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.name IS DISTINCT FROM OLD.name THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES ('maintenance_cases', NEW.id, 'name', to_jsonb(OLD.name), to_jsonb(NEW.name), actor);
    END IF;

    IF NEW.estimated_hours IS DISTINCT FROM OLD.estimated_hours THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES (
        'maintenance_cases',
        NEW.id,
        'estimated_hours',
        to_jsonb(OLD.estimated_hours),
        to_jsonb(NEW.estimated_hours),
        actor
      );
    END IF;

    IF NEW.estimated_costs IS DISTINCT FROM OLD.estimated_costs THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES (
        'maintenance_cases',
        NEW.id,
        'estimated_costs',
        to_jsonb(OLD.estimated_costs),
        to_jsonb(NEW.estimated_costs),
        actor
      );
    END IF;

    IF NEW.planned_start IS DISTINCT FROM OLD.planned_start THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES (
        'maintenance_cases',
        NEW.id,
        'planned_start',
        to_jsonb(OLD.planned_start),
        to_jsonb(NEW.planned_start),
        actor
      );
    END IF;

    IF NEW.planned_end IS DISTINCT FROM OLD.planned_end THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES (
        'maintenance_cases',
        NEW.id,
        'planned_end',
        to_jsonb(OLD.planned_end),
        to_jsonb(NEW.planned_end),
        actor
      );
    END IF;

    IF NEW.offer_created_by IS DISTINCT FROM OLD.offer_created_by THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES (
        'maintenance_cases',
        NEW.id,
        'offer_created_by',
        to_jsonb(OLD.offer_created_by),
        to_jsonb(NEW.offer_created_by),
        actor
      );
    END IF;

    IF NEW.offer_created_at IS DISTINCT FROM OLD.offer_created_at THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES (
        'maintenance_cases',
        NEW.id,
        'offer_created_at',
        to_jsonb(OLD.offer_created_at),
        to_jsonb(NEW.offer_created_at),
        actor
      );
    END IF;

    IF NEW.offer_accepted_at IS DISTINCT FROM OLD.offer_accepted_at THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES (
        'maintenance_cases',
        NEW.id,
        'offer_accepted_at',
        to_jsonb(OLD.offer_accepted_at),
        to_jsonb(NEW.offer_accepted_at),
        actor
      );
    END IF;

    IF NEW.invoice_created_by IS DISTINCT FROM OLD.invoice_created_by THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES (
        'maintenance_cases',
        NEW.id,
        'invoice_created_by',
        to_jsonb(OLD.invoice_created_by),
        to_jsonb(NEW.invoice_created_by),
        actor
      );
    END IF;

    IF NEW.invoice_created_at IS DISTINCT FROM OLD.invoice_created_at THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES (
        'maintenance_cases',
        NEW.id,
        'invoice_created_at',
        to_jsonb(OLD.invoice_created_at),
        to_jsonb(NEW.invoice_created_at),
        actor
      );
    END IF;

    IF NEW.invoice_paid_at IS DISTINCT FROM OLD.invoice_paid_at THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES (
        'maintenance_cases',
        NEW.id,
        'invoice_paid_at',
        to_jsonb(OLD.invoice_paid_at),
        to_jsonb(NEW.invoice_paid_at),
        actor
      );
    END IF;

    IF NEW.updated_at IS DISTINCT FROM OLD.updated_at THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES (
        'maintenance_cases',
        NEW.id,
        'updated_at',
        to_jsonb(OLD.updated_at),
        to_jsonb(NEW.updated_at),
        actor
      );
    END IF;

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
    VALUES ('maintenance_cases', OLD.id, 'row_deleted', to_jsonb(OLD), NULL, actor);
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS maintenance_cases_audit_insert ON maintenance_cases;
DROP TRIGGER IF EXISTS maintenance_cases_audit_update ON maintenance_cases;
DROP TRIGGER IF EXISTS maintenance_cases_audit_delete ON maintenance_cases;

CREATE TRIGGER maintenance_cases_audit_insert
AFTER INSERT ON maintenance_cases
FOR EACH ROW EXECUTE FUNCTION log_maintenance_cases_changes();

CREATE TRIGGER maintenance_cases_audit_update
AFTER UPDATE ON maintenance_cases
FOR EACH ROW EXECUTE FUNCTION log_maintenance_cases_changes();

CREATE TRIGGER maintenance_cases_audit_delete
AFTER DELETE ON maintenance_cases
FOR EACH ROW EXECUTE FUNCTION log_maintenance_cases_changes();

-- Add audit triggers for staff
CREATE OR REPLACE FUNCTION log_staff_changes() RETURNS trigger AS $$
DECLARE
  actor text := current_setting('app.current_user', true);
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
    VALUES ('staff', NEW.id, 'row_created', NULL, to_jsonb(NEW), actor);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.first_name IS DISTINCT FROM OLD.first_name THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES ('staff', NEW.id, 'first_name', to_jsonb(OLD.first_name), to_jsonb(NEW.first_name), actor);
    END IF;

    IF NEW.last_name IS DISTINCT FROM OLD.last_name THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES ('staff', NEW.id, 'last_name', to_jsonb(OLD.last_name), to_jsonb(NEW.last_name), actor);
    END IF;

    IF NEW.email IS DISTINCT FROM OLD.email THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES ('staff', NEW.id, 'email', to_jsonb(OLD.email), to_jsonb(NEW.email), actor);
    END IF;

    IF NEW.phone IS DISTINCT FROM OLD.phone THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES ('staff', NEW.id, 'phone', to_jsonb(OLD.phone), to_jsonb(NEW.phone), actor);
    END IF;

    IF NEW.birthday IS DISTINCT FROM OLD.birthday THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES ('staff', NEW.id, 'birthday', to_jsonb(OLD.birthday), to_jsonb(NEW.birthday), actor);
    END IF;

    IF NEW.hourly_rate IS DISTINCT FROM OLD.hourly_rate THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES ('staff', NEW.id, 'hourly_rate', to_jsonb(OLD.hourly_rate), to_jsonb(NEW.hourly_rate), actor);
    END IF;

    IF NEW.vacation_days_total IS DISTINCT FROM OLD.vacation_days_total THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES ('staff', NEW.id, 'vacation_days_total', to_jsonb(OLD.vacation_days_total), to_jsonb(NEW.vacation_days_total), actor);
    END IF;

    IF NEW.vacation_days_used IS DISTINCT FROM OLD.vacation_days_used THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES ('staff', NEW.id, 'vacation_days_used', to_jsonb(OLD.vacation_days_used), to_jsonb(NEW.vacation_days_used), actor);
    END IF;

    IF NEW.sick_days_used IS DISTINCT FROM OLD.sick_days_used THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES ('staff', NEW.id, 'sick_days_used', to_jsonb(OLD.sick_days_used), to_jsonb(NEW.sick_days_used), actor);
    END IF;

    IF NEW.is_active IS DISTINCT FROM OLD.is_active THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES ('staff', NEW.id, 'is_active', to_jsonb(OLD.is_active), to_jsonb(NEW.is_active), actor);
    END IF;

    IF NEW.updated_at IS DISTINCT FROM OLD.updated_at THEN
      INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
      VALUES ('staff', NEW.id, 'updated_at', to_jsonb(OLD.updated_at), to_jsonb(NEW.updated_at), actor);
    END IF;

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, record_id, column_name, old_value, new_value, changed_by)
    VALUES ('staff', OLD.id, 'row_deleted', to_jsonb(OLD), NULL, actor);
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
DROP TRIGGER IF EXISTS staff_audit_insert ON staff;
--> statement-breakpoint
DROP TRIGGER IF EXISTS staff_audit_update ON staff;
--> statement-breakpoint
DROP TRIGGER IF EXISTS staff_audit_delete ON staff;
--> statement-breakpoint
CREATE TRIGGER staff_audit_insert
AFTER INSERT ON staff
FOR EACH ROW EXECUTE FUNCTION log_staff_changes();
--> statement-breakpoint
CREATE TRIGGER staff_audit_update
AFTER UPDATE ON staff
FOR EACH ROW EXECUTE FUNCTION log_staff_changes();
--> statement-breakpoint
CREATE TRIGGER staff_audit_delete
AFTER DELETE ON staff
FOR EACH ROW EXECUTE FUNCTION log_staff_changes();

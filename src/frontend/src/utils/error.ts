/**
 * Parses errors from Django REST Framework responses into field and non‑field errors.
 *
 * @param data – the raw error payload from DRF
 * @returns an object with `fieldErrors` (по‑полю) и `nonFieldErrors` (общие)
 */
export interface DRFErrorResponse {
    fieldErrors: Record<string, string[]>;
    nonFieldErrors: string[];
  }
  
  export function parseDRFErrors(data: any): DRFErrorResponse {
    const fieldErrors: Record<string, string[]> = {};
    const nonFieldErrors: string[] = [];
  
    // Список общих ошибок
    if (Array.isArray(data)) {
      data.forEach(err => {
        if (typeof err === 'string') {
          nonFieldErrors.push(err);
        } else if (err && typeof err === 'object') {
          nonFieldErrors.push(JSON.stringify(err));
        }
      });
  
    // Объект ошибок вида { field: [...], non_field_errors: [...] }
    } else if (data && typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'non_field_errors' || key === 'detail') {
          // Общие ошибки
          if (Array.isArray(value)) {
            nonFieldErrors.push(...value.map(String));
          } else {
            nonFieldErrors.push(String(value));
          }
        } else {
          // Ошибки конкретного поля
          if (Array.isArray(value)) {
            fieldErrors[key] = value.map(String);
          } else {
            fieldErrors[key] = [String(value)];
          }
        }
      });
  
    // Если сервер вернул просто строку
    } else if (typeof data === 'string') {
      nonFieldErrors.push(data);
    }
  
    return { fieldErrors, nonFieldErrors };
  }
  
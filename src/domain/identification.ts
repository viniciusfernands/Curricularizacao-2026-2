/** Campos opcionais. String vazia representa informação não fornecida. */
export interface Identification {
  school: string;
  classGroup: string;
  schoolYear: string;
  teacher: string;
  child: string;
}

export function normalizeIdentification(value: Partial<Identification> = {}): Identification {
  return {
    school: value.school?.trim() ?? '',
    classGroup: value.classGroup?.trim() ?? '',
    schoolYear: value.schoolYear?.trim() ?? '',
    teacher: value.teacher?.trim() ?? '',
    child: value.child?.trim() ?? '',
  };
}

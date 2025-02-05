import { OperatingDaysNote } from '../shared/models/operating-day-note.model';
import { NoteTypeEnum } from '../providers/operating-days-note.service';
import { Utils } from './utils';
import * as Raven from 'raven-js';

export class OperatingDayNoteUtil {
  public static getByType(items: OperatingDaysNote[], noteType: NoteTypeEnum): OperatingDaysNote {
    const typeList = OperatingDayNoteUtil.getByTypeList(items, noteType);
    if (typeList && typeList.length) {
      return typeList[0];
    }
  }

  public static getByTypeList(items: OperatingDaysNote[], noteType: NoteTypeEnum): OperatingDaysNote[] {
    try {
      if (Utils.isNullOrUndefined(items)) {
        return null;
      }
      return items.filter((val) => {
        return !Utils.isNullOrUndefined(val.note_type) && !Utils.isNullOrUndefined(noteType) && val.note_type.toString() === noteType.toString();
      });
    } catch (e) {
      Raven.captureException(e);
      console.error(e);
    }
  }
}

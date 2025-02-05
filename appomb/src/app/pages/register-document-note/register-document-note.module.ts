import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { RegisterDocumentNote } from "./register-document-note";
import { SharedModule } from "../../shared/shared.module";
import { RegisterDocumentNoteRoutingModule } from "./register-document-note-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    RegisterDocumentNote,
  ],
  imports: [
    RegisterDocumentNoteRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    RegisterDocumentNote
  ]
})
export class RegisterDocumentNoteModule {
}

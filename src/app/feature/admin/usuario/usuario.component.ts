import {Component, OnInit, OnDestroy} from "@angular/core";
import {BasicButtonComponent} from "../../../components/buttons/basic-button/basic-button.component";
import {Router} from "@angular/router";
import { UserService } from "../../../core/service/user.service";
import { TableComponent } from "../../../components/table/basic-table/table.component";
import { sharedModules } from "../../../shared/shared.module";
import {BasicAutocompleteComponent} from "../../../components/autocompletes/basic-autocomplete.component";
import {miniTableComponent} from "../../../components/table/mini-table/mini-table.component";
import {Subject, takeUntil} from "rxjs";
import {Usercolumns} from "../../../core/interfaces/components/crear-usuario/crear-usuario.interface";
import {TableColumn} from "../../../core/interfaces/components/table/basic-table/basic-table.interface";
import { BasicModalComponent } from "../../../components/modal/basic-modal/basic-modal.component";
import { Usuario } from "../../../core/interfaces/components/usuario/usuario.interface";
import {refreshTunnel} from "../../../core/tunnel/usuario/usuario.tunnel";
import {filterTableComponent} from "../../../components/table/filter-table/filter-table.component";
import {NotFound} from "../../../components/not-found/not-found.component";
import {MasterTableComponent} from "../../../components/table/master-table/master-table.component";
import {BasicBorderComponent} from "../../../components/border/basic-border.component";
import {ModalInputComponent} from "../../../components/inputs/modal-input/modal-input.component";
import {BasicHeaderComponent} from "../../../components/header/basic-header/basic-header.component";

@Component({
  selector: 'app-usuario-admin',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  standalone: true,
  imports: [[...sharedModules],
    BasicButtonComponent, BasicAutocompleteComponent,
    MasterTableComponent, BasicHeaderComponent
  ],
})

export class UsuarioAdminComponent implements OnInit, OnDestroy {
  dataSource: Usuario[] = [];
  overflow: boolean | undefined = false;
  private destroy$ = new Subject<void>();

  columns: TableColumn[] = Usercolumns;

  idKey= 'usuario_id';

  refreshUser = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private refreshTunnel: refreshTunnel
  ) {}

  ngOnInit() {
    this.handleRefreshUser()
    this.getUsers()
  }

  navegateCreate(){
    this.router.navigate(["/home/administracion-usuarios/crear"]);
  }

  handleOverflow(isOverflowing: boolean | undefined): void {
    this.overflow = isOverflowing;
  }

  handleRefreshUser(){
    this.refreshTunnel.refresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(refresh => {
        this.refreshUser = refresh;
      })
  }

  getUsers(){
    this.userService.getUsers(this.refreshUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.dataSource = data
        this.refreshTunnel.setrefreshState(false)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

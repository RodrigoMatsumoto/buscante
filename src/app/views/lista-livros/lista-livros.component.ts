import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, filter, map, switchMap, tap, throwError } from 'rxjs';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

import { LivrosResultado } from '../../models/interfaces';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';

const PAUSA = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-50px)' }),
          stagger('100ms', [
            animate('500ms ease-out', keyframes([
              style({ opacity: 0, transform: 'translateY(-50px)', offset: 0 }),
              style({ opacity: 0.5, transform: 'translateY(-25px)', offset: 0.3 }),
              style({ opacity: 1, transform: 'none', offset: 1 }),
            ])),
          ]),
        ], { optional: true }),
        query(':leave', [
          stagger('100ms', [
            animate('500ms ease-out', keyframes([
              style({ opacity: 1, transform: 'none', offset: 0 }),
              style({ opacity: 0.5, transform: 'translateY(-25px)', offset: 0.3 }),
              style({ opacity: 0, transform: 'translateY(-50px)', offset: 1 }),
            ])),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ]
})

export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    tap(() => console.log('Fluxo inicial de dados')),
    filter((valorDigitado) => valorDigitado.length >= 3),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map((resultado) => this.livrosResultado = resultado),
    map((resultado) => resultado.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    tap(() => console.log('Requisição ao servidor')),
    catchError(erro => {
      // this.mensagemErro = 'Ops, ocorreu um erro. Recarregue a aplicação!'
      // return EMPTY;
      console.log(erro);
      return throwError(() => new Error(this.mensagemErro = 'Ops, ocorreu um erro. Recarregue a aplicação!'));
    })
  )

  constructor(private service: LivroService) { }

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item);
    })
  }
}

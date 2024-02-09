import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, filter, map, switchMap, tap, throwError } from 'rxjs';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

import { LivrosResultado } from '../../models/interfaces';

const PAUSA = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
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

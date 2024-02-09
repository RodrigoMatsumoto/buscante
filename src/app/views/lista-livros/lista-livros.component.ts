import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap, throwError } from 'rxjs';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = '';

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('Fluxo inicial')),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    tap((retornoAPI) => console.log(retornoAPI)),
    map((items) => this.livrosResultadoParaLivros(items)),
    tap(() => console.log('Requisição ao servidor')),
    catchError(erro => {
      this.mensagemErro = 'Ops, ocorreu um erro. Recarregue a aplicação!'
      return EMPTY;
      // console.log(erro);
      // return throwError(() => new Error(this.mensagemErro = 'Ops, ocorreu um erro. Recarregue a aplicação!'));
    })
  )

  constructor(private service: LivroService) { }

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item);
    })
  }
}

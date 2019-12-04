import {fromEvent, EMPTY} from "rxjs";
import {map, debounceTime, distinctUntilChanged, switchMap, mergeMap, tap,catchError, filter} from "rxjs/operators";
import {ajax} from "rxjs/ajax";
const url = "https://api.github.com/search/users?q=";

// const search = document.getElementById("search");

// const stream$ = fromEvent(search, "input")
//     .pipe(
//         map(e => e.target.value),
//         debounceTime(1000),//интервал через который отправляется значение
//         distinctUntilChanged(),//влзвращает занчение которое не повторяется с предыдущим 
//         // tap(() => )
//         filter(v => v.trim())
//         switchMap( v => ajax.getJSON(url + v)).pipe(
//             catchError(err => EMPTY)
//         ),//создает новый стрим
//         map (response => response.items),// вытаскивает значения из нового стрима 
//         mergeMap(items => items)//реагирует на каждый запрос
//     )
// stream$.subscribe(value => {
//     console.log(value);
// })
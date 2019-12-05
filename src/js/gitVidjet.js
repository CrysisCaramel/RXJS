import {fromEvent, EMPTY} from "rxjs";
import {map, debounceTime, distinctUntilChanged, switchMap, mergeMap, tap,catchError, filter, take} from "rxjs/operators";
import {ajax} from "rxjs/ajax";

const url = "https://api.github.com/users";

function createBlock(value) {
    const items = document.querySelector(".git-vidjet_items")
    const wrap = document.createElement("div");
    const user = document.createElement("div");
    const img = document.createElement("img");
    const userWrapInfo = document.createElement("div");
    const userWrapInfoTitle = document.createElement("div");
    const userWrapInfoLocation = document.createElement("div");
    const userWrapInfoLink = document.createElement("a");
    const btnToTrash = document.createElement("a");
    const userDelete = document.createElement("div");
    wrap.classList.add("git-vidjet_items_wrapper");
    user.classList.add("user");
    img.classList.add("img");
    userWrapInfo.classList.add("user_wrapInfo");
    userWrapInfoTitle.classList.add("user_wrapInfo_title");
    userWrapInfoLocation.classList.add("user_wrapInfo_location")
    userWrapInfoLink.classList.add("user_wrapInfo_link");
    btnToTrash.classList.add("btnToTrash");
    userDelete.classList.add("userDelete");
    items.appendChild(wrap)
    wrap.appendChild(user)
    wrap.appendChild(userDelete)
    user.appendChild(img)
    user.appendChild(userWrapInfo)
    user.appendChild(btnToTrash)
    userWrapInfo.appendChild(userWrapInfoTitle)
    userWrapInfo.appendChild(userWrapInfoLocation)
    userWrapInfo.appendChild(userWrapInfoLink)
    img.src = value.avatar_url
    userWrapInfoTitle.textContent = value.name
    userWrapInfoLocation.innerHTML = `
    <i class="fas fa-map-marker-alt"></i>
    ${value.location}
    `;
    userWrapInfoLink.href = value.html_url
    userWrapInfoLink.textContent = `@${value.login}`
    btnToTrash.innerHTML = `
        <span class="up"></span>
        <span class="down"></span>
    `;
    userDelete.innerHTML = `
    <i class="far fa-trash-alt"></i>
    `
    btnToTrash.addEventListener("click", function() {
    user.classList.toggle("userScroll")
    userDelete.classList.toggle("userDeleteView")
    })
}

const refresh = document.querySelector(".git-vidjet_refresh_group_refresh");

const stream$ = fromEvent(refresh, "click")
    .pipe(
        switchMap( () => ajax.getJSON(url)),
        // mergeMap (response => response, 3),
        map (response => response[Math.ceil(Math.random()*29)].url),
        switchMap(value => ajax.getJSON(value)),
        take(3)
    )
stream$.subscribe(value => {
    createBlock(value)
})

// map(e => e+1),
// debounceTime(1000),//интервал через который отправляется значение
// distinctUntilChanged(),//влзвращает занчение которое не повторяется с предыдущим 
// // tap(() => )
// filter(v => v.trim()),
// вытаскивает значения из нового стрима 
// mergeMap(items => items)//реагирует на каждый запрос
// .pipe(
//     // catchError(err => EMPTY)
// ),//создает новый стрим
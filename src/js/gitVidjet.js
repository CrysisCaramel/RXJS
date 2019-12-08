import {fromEvent, EMPTY, range, from, interval} from "rxjs";
import {map, debounceTime, distinctUntilChanged, switchMap, mergeMap, tap,catchError, filter, take, repeat, scan, takeWhile, delayWhen, takeLast, switchMapTo, concatAll, concatMap} from "rxjs/operators";
import {ajax} from "rxjs/ajax";
import { promised } from "q";


function getStartedGitVidjet() {
    const url = "https://api.github.com/users",
    refresh = document.querySelector(".git-vidjet_refresh_group_refresh"),
    items = document.querySelector(".git-vidjet_items"),
    userDelete = document.querySelector(".userDelete");

    function createBlock(value) {
        function createElement(element) {
            return document.createElement(element)
        }
        const wrap = createElement("div");
        wrap.classList.add("git-vidjet_items_wrapper");
        const user = createElement("div");
        user.classList.add("user");
        const btnToTrash = createElement("a");
        btnToTrash.classList.add("btnToTrash");
        const userDelete = createElement("div");
        userDelete.classList.add("userDelete");
        items.appendChild(wrap);
        wrap.appendChild(user);
        wrap.appendChild(userDelete)
        user.innerHTML = `
            <img src="${value.avatar_url}" class="img">
            <div class="user_wrapInfo">
                <div class="user_wrapInfo_title">${value.name}</div>
                <div class="user_wrapInfo_location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${value.location}
                </div>
                <a href="${value.html_url}" class="user_wrapInfo_link">@${value.login}</a>
            </div>
        `;
        userDelete.innerHTML =`<i class="far fa-trash-alt"></i>`;
        user.appendChild(btnToTrash)
        btnToTrash.innerHTML = `<span class="up"></span>
        <span class="down"></span>`;
        btnToTrash.addEventListener("click", function() {
        user.classList.toggle("userScroll")
        userDelete.classList.toggle("userDeleteView")
        })
        // createDeleteUserStream(value,userDelete)
    }

    function generateUsers(value, number) {
        setTimeout(() => {
            const random = Math.ceil(Math.random() * (value.length - number)),
            desiredUsers = value.slice(random, random+number),
            storeUsersUrls = desiredUsers.map(url => fetch(url));
            Promise.all(storeUsersUrls)
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(responses => {
                responses.forEach(dataUser => {
                    createBlock(dataUser)
                })
            })
        }, 1500)
    }

    function createMainStream() {
        const stream$ = ajax.getJSON(url).pipe(
            mergeMap(items => items),
            map(data => data.url),
            scan((acc,v) => acc.concat(v), []),
            takeLast(1),
            tap(data => {
                generateUsers(data, 3)
            }),
            concatMap((data) => fromEvent(refresh, "click").pipe(
                tap(() => items.innerHTML = ""),
                map(() => data),
            )),
            switchMap(() => fromEvent(userDelete, "click").pipe(
                tap(dat => console.log(dat))
            ))
            
        )
        stream$.subscribe(
            (value) => {
                generateUsers(value, 3)
            })
    }
    
    // function createDeleteUserStream(value, btn) {
    //     const deleteUser$ = fromEvent(btn, "click")
    //     .pipe(
    //         tap(() => alert("sadsad"))
    //     )
    //     deleteUser$.subscribe(value => {

    //     })
    // }

    createMainStream()
}

getStartedGitVidjet()

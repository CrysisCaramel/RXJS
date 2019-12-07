import {fromEvent, EMPTY, range, from} from "rxjs";
import {map, debounceTime, distinctUntilChanged, switchMap, mergeMap, tap,catchError, filter, take, repeat, scan} from "rxjs/operators";
import {ajax} from "rxjs/ajax";


function getStartedGitVidjet() {
    const url = "https://api.github.com/users",
    refresh = document.querySelector(".git-vidjet_refresh_group_refresh"),
    items = document.querySelector(".git-vidjet_items");
    
    let users = [];

    function generateUserBlock() {
        const random = Math.ceil(Math.random()*29)
        const user = users[random]
        createUserBlock(user)
    }

    function deleteUser(deleteButton, wrapper) {
        const streamDelete$ = fromEvent(deleteButton, "click").pipe(
            tap(() => {
                wrapper.remove()
            })
        )
        streamDelete$.subscribe(() => {
            createUserBlock(users[Math.ceil(Math.random()*29)])
        })
    }

    function createBlock(value) {
        const wrap = document.createElement("div");
        const user = document.createElement("div");
        const img = document.createElement("img");
        const userWrapInfo = document.createElement("div");
        const userWrapInfoTitle = document.createElement("div");
        const userWrapInfoLocation = document.createElement("div");
        const userWrapInfoLink = document.createElement("a");
        const btnToTrash = document.createElement("createUserBlock");
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
        deleteUser(userDelete, wrap)
        })
    }

    function createUserBlock(user) {
        setTimeout(() => {
            fetch(user).then(data => {
                return data.json()
            }).then(data => {
                createBlock(data)
            })
        }, 1000);
    } 

    const stream$ = ajax.getJSON(url).pipe(
        debounceTime(1000),
        mergeMap(items => items),
        map(value => value.url),
    );
    stream$.subscribe(
        (value) => users.push(value), 
        (err) => console.log(err), 
        () => {
            generateUserBlock();
            generateUserBlock();
            generateUserBlock();
            const streamRefresh$ = fromEvent(refresh, "click").pipe(
                tap(() => items.innerHTML = "")
            )
            streamRefresh$.subscribe(() => {
                generateUserBlock();
                generateUserBlock();
                generateUserBlock();
            })
        }
    )
}

getStartedGitVidjet()


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
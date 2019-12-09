import {fromEvent, of} from "rxjs";
import { map, debounceTime, distinctUntilChanged, switchMap, mergeMap, tap, filter, mergeAll,} from "rxjs/operators";
import { ajax } from "rxjs/ajax";

function getStartedGitWidget() {


    const url = "https://api.github.com/users",
        refresh = document.querySelector(".git-widget_refresh_group_refresh"),
        items = document.querySelector(".git-widget_items"),
        refreshAnimate = document.querySelector((".fa-sync-alt"));

    class Block {
        constructor(userData) {
            this.userData = userData;
            this.wrapper = document.createElement("div");
            this.user = document.createElement("div"),
                this.btnToTrash = document.createElement("a"),
                this.userDelete = document.createElement("div");
            this.userDataProcessing();
        }

        userDataProcessing() {
            this.wrapper.innerHTML = ""
            fetch(this.userData).then(data => data.json()).then(data => {
                this.addElements(data);
                this.viewBasket()
            })
        }

        addElements(data) {
            this.wrapper.classList.add("git-widget_items_wrapper")
            this.user.classList.add("user");
            this.btnToTrash.classList.add("btnToTrash");
            this.userDelete.classList.add("userDelete");
            items.appendChild(this.wrapper)
            this.wrapper.appendChild(this.user);
            this.wrapper.appendChild(this.userDelete);
            this.user.innerHTML = `
                <img src="${data.avatar_url}" class="img">
                <div class="user_wrapInfo">
                    <div class="user_wrapInfo_title">${data.name}</div>
                    <div class="user_wrapInfo_location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${data.location}
                    </div>
                    <a href="${data.html_url}" class="user_wrapInfo_link">@${data.login}</a>
                </div>
            `;
            this.user.appendChild(this.btnToTrash)
            this.userDelete.innerHTML = `<i class="far fa-trash-alt"></i>`;
            this.btnToTrash.innerHTML = `<span class="up"></span>
            <span class="down"></span>`;
        }

        viewBasket() {
            this.btnToTrash.addEventListener("click", () => {
                this.user.classList.toggle("userScroll")
                this.userDelete.classList.toggle("userDeleteView")
            })
        }
    }

    function updateUsers(data) {
        const updateStream$ = fromEvent(refresh, "click").pipe(
            tap(value => {
                items.innerHTML = ""
                refreshAnimate.classList.add("animate")
                setTimeout(() => {
                    refreshAnimate.classList.remove("animate")
                }, 1000)
            }),
            map(() => {
                const random = Math.ceil(Math.random() * 27);
                return data.slice(random, (random + 3))
            }),
            distinctUntilChanged()
        )
        return updateStream$
    }

    function deleteUser(data) {
        const deleteUser$ = fromEvent(items, "click").pipe(
            filter(value => value.target.classList.contains("fa-trash-alt")),
            tap(value => value.path[2].remove()),
            map(() => {
                const random = Math.ceil(Math.random() * 28);
                return data.slice(random, (random + 1))
            }),
        )
        return deleteUser$
    }

    function generateBlock(number, data) {
        for (let i = 1; i <= number; i++) {
            const block = new Block(data[i])
        }
    }

    const mainStream$ = ajax.getJSON(url).pipe(
        map(data => data.map(user => user.url)),
        tap(data => {
            generateBlock(3, data)
        }),
        switchMap(data => of (updateUsers(data), deleteUser(data)).pipe(
            mergeAll()
        ))
    )
    mainStream$.subscribe(value => {
        for (let i = 0; i < value.length; i++) {
            const block = new Block(value[i])
        }
    })

}
getStartedGitWidget()
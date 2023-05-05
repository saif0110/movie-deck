var movies = [], favMovies;
const section = document.getElementsByClassName("section");
if(localStorage.favMovies === undefined){
    localStorage.setItem("favMovies", JSON.stringify([]));
}
/*  structure of the card...
    <div class="card">
            <img src="https://bollywoodmovieposters.com/wp-content/uploads/2021/02/shahrukh-khan-film-poster-chennai-express.jpg" alt="loading..." height="150px" width="100px">
            <h3>Movie Name</h2>
            <div class="hide-show">
                
                <p>Release date: 10/02/199</p>
                <p>Average rating: 8.45</p>
                <p>Number of rating: 178</p>
                
                
            </div>
            <button>Show more</button>

        </div>
*/

function createCard(movie, id, title, poster_path, release_date, vote_average, vote_count, whereToAdd){
    let div = document.createElement("div");
    div.classList.add("my-card");
    let img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500${poster_path}`;
    img.alt = "Loading..";
    img.height = "150";
    img.width = "100";
    let h3 = document.createElement("h3");
    h3.textContent = title;

    let btn2 = document.createElement("button");
    btn2.innerHTML = (whereToAdd === "Add to fav-movies")? "Remove from favorite" : "Add to favorite";
    if(whereToAdd === "Add to movies"){
        console.log("inside target");
        favMovies = JSON.parse(localStorage.getItem("favMovies"));
        btn2.innerHTML = (favMovies.find((movie)=>{return (movie.id === id)})) ? "Remove from favorite" : "Add to favorite";
    }
    btn2.id = (whereToAdd === "Add to fav-movies") ? `${id}-fav-movies` : `${id}-all movies`;
    btn2.style.width = "150px";
    btn2.addEventListener("click", ()=>{
        favMovies = JSON.parse(localStorage.getItem("favMovies"));
       if(btn2.innerHTML === "Add to favorite"){
            favMovies.push(movie);
            localStorage.setItem("favMovies", JSON.stringify(favMovies));
            btn2.innerHTML = "Remove from favorite";
            // create and push the card into favorite section.
        }else{
            if(btn2.innerHTML === "Remove from favorite"){
                btn2.innerHTML = "Add to favorite";
                if(btn2.parentElement.parentElement.getAttribute("id") === "fav-movies" ){
                    localStorage.setItem("favMovies", JSON.stringify(favMovies.filter((movie)=>{return (movie.id !==  id) })));
                    btn2.parentElement.style.cssText= `
                        padding : 0px;
                        width : 0px;
                    `;
                    btn2.parentElement.innerHTML = "";
                    document.getElementById(`${id}-all movies`).innerHTML = "Add to favorite";
                }else{
                    localStorage.setItem("favMovies", JSON.stringify(favMovies.filter((movie)=>{return (movie.id !==  id) })));
                }
                // btn2.parentElement.style.height = "0px";
                // btn2.parentElement.style.width = "0px";
            }
            if(whereToAdd !== "Add to fav-movies")
                btn2.innerHTML = "Add to favorite";
        }
    });

    let innerDiv = document.createElement("div");
    innerDiv.classList.add("hide-show");

    let btn = document.createElement("button");
    btn.innerHTML = "Show More";
    // btn.value = "show-more";
    btn.addEventListener("click", ()=>{hideShow(release_date, vote_average, vote_count, innerDiv, btn)});

    div.append(img, h3, btn2,  innerDiv, btn);

    (whereToAdd === "Add to movies") ? section[0].appendChild(div) : section[1].appendChild(div);    

}

async function retrieveMovies(){
    const response = await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=f1a87d30ad8792e0dd1c12ce07d37337&language=en-US&page=1");
    const data = await response.json();
    // console.log(data.results);
    movies.push(...data.results);
    movies.sort((a, b)=>{return (b.vote_count - a.vote_count)});
    section[0].innerHTML = "";
    movies.forEach((movie)=>{
        createCard(movie, movie.id, movie.title, movie.poster_path, movie.release_date, movie.vote_average, movie.vote_count, "Add to movies");
    });
    // console.log(movies);
}
retrieveMovies();

function hideShow(release_date, vote_average, vote_count, innerDiv, btn){
    let p1 = document.createElement("div");
    p1.textContent = `Release date: ${release_date}`;
    let p2 = document.createElement("div");
    p2.textContent = `Average rating: ${vote_average}`;
    let p3 = document.createElement("div");
    p3.textContent = `Number of rating: ${vote_count}`;
    // console.log(btn.innerHTML);
    if(btn.innerHTML === "Show More"){
        btn.innerHTML = "Show Less";
        innerDiv.append(p1, p2, p3);
    }else{
        btn.innerHTML = "Show More";
        innerDiv.innerHTML = "";
    }
}

const regex = /^[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d]*$/g;
function searchByName(target){
    // console.log(target.value);
   if(regex.test(target.value)){
        alert("invalid search!");
   }
    const filteredMovie = movies.filter((movie)=>{
        return movie.title.toLowerCase().includes(target.value.toLowerCase())
    });
    section[0].innerHTML="";
    filteredMovie.forEach((movie)=>{
        createCard(movie, movie.id, movie.title, movie.poster_path, movie.release_date, movie.vote_average, movie.vote_count, "Add to movies");
    });
}

const selectedElement = document.getElementsByTagName("select");
// console.log(selectedElement);

function arranageFormate(){
    let value = selectedElement[0].value;
    switch(value){
        case "rating-desc":
                movies.sort((a, b)=>{return (b.vote_count - a.vote_count)});
                section[0].innerHTML = "";
                movies.forEach((movie)=>{
                    createCard(movie, movie.id, movie.title, movie.poster_path, movie.release_date, movie.vote_average, movie.vote_count, "Add to movies");
                });
                break;
        case "rating-asc":
            movies.sort((a, b)=>{return (a.vote_count - b.vote_count)});
            section[0].innerHTML = "";
            movies.forEach((movie)=>{
                createCard(movie, movie.id, movie.title, movie.poster_path, movie.release_date, movie.vote_average, movie.vote_count, "Add to movies");
            });
                break;
        case "release-desc":
            movies.sort((a, b)=>{return (b.release_date.localeCompare(a.release_date))});
            section[0].innerHTML = "";
            movies.forEach((movie)=>{
                createCard(movie, movie.id, movie.title, movie.poster_path, movie.release_date, movie.vote_average, movie.vote_count, "Add to movies");
            });
                break;
        case "release-asc":
            movies.sort((a, b)=>{return (a.release_date.localeCompare(b.release_date))});
                section[0].innerHTML = "";
                movies.forEach((movie)=>{
                    createCard(movie, movie.id, movie.title, movie.poster_path, movie.release_date, movie.vote_average, movie.vote_count, "Add to movies");
                });
            break;
    }
}

function addCardToFavoriteTab(){
    section[1].innerHTML = "";
        favMovies = JSON.parse(localStorage.getItem("favMovies"));
        favMovies.forEach((movie)=>{
            createCard(movie, movie.id, movie.title, movie.poster_path, movie.release_date, movie.vote_average, movie.vote_count, "Add to fav-movies")
        });
        createOnes = false;
}

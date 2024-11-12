// figuring time
function calculateTime(time){
    let hour = parseInt(time/3600);
    let remHour = time % 3600;
    
    let minute = parseInt(remHour / 60);
    let remMinute = (remHour % 60);
 
    return `${hour}hrs ${minute}minute ago`
 }

//create loadCatagories
const loadCatagories = () => {
  //fetch
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => DisplayCatagories(data.categories))
    .catch((error) => console.log(error));
};

const loadVideos = (searchText = "") => {
  //fetch
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};

// const cardDemo = {
//   category_id: "1001",
//   video_id: "aaaa",
//   thumbnail: "https://i.ibb.co/L1b6xSq/shape.jpg",
//   title: "Shape of You",
//   authors: [
//     {
//       profile_picture: "https://i.ibb.co/D9wWRM6/olivia.jpg",
//       profile_name: "Olivia Mitchell",
//       verified: "",
//     },
//   ],
//   others: {
//     views: "100K",
//     posted_date: "16278",
//   },
//   description:
//     "Dive into the rhythm of 'Shape of You,' a captivating track that blends pop sensibilities with vibrant beats. Created by Olivia Mitchell, this song has already gained 100K views since its release. With its infectious melody and heartfelt lyrics, 'Shape of You' is perfect for fans looking for an uplifting musical experience. Let the music take over as Olivia's vocal prowess and unique style create a memorable listening journey.",
// };

// video details after btn click
// video_id ashtese parameter a 
let loadDetails = async(videoId) => {
  console.log(videoId);

  let uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;

  let res = await fetch(uri);
  let data = await res.json();
   
  displayVideoDetails(data.video);
};

// display videoDetails
let displayVideoDetails = (video) => {
  console.log(video);
  
  let detailContainer = document.getElementById('modal-content');

  detailContainer.innerHTML = `
   <img src = ${video.thumbnail} />
   <p class = "mt-2">${video.description}</p>
  `;

  document.getElementById('showModal').click();
  
}

const displayVideos = (videos) => {
  const videosContainer = document.getElementById("videos");
  //  clearing the existing videos to show new.
  videosContainer.innerHTML = "";

  if(videos.length == 0){
    videosContainer.classList.remove("grid");
    videosContainer.innerHTML = `
      <div class = "min-h-[350px] flex flex-col justify-center items-center  space-y-3">
        <img src = "./assets/Icon.png">
        <h3 class = "text-3xl font-bold">Oops!! Sorry, There is no content here</h3>
      </div>
    `;
    return;
  }
  else{
     videosContainer.classList.add("grid");
  }

  videos.forEach((video) => {
    // console.log(video);

    const card = document.createElement("div");
    card.classList = "card card-compact";
    card.innerHTML = `
    <figure class = "h-[200px] relative">
      <img
        src= ${video.thumbnail}
        class = "h-full w-full object-cover"
        alt="Shoes" />

        ${
            video.others.posted_date?.length == 0 ? "": `<span class = "absolute right-2 bottom-2 text-white text-xs bg-black p-2 rounded-lg">${calculateTime(video.others.posted_date)}</span>` 
        }
        
    </figure>
    <div class="px-0 py-2 flex gap-2">
       <div>
          <img class = "w-10 h-10 rounded-full object-cover" src="${video.authors[0].profile_picture}">
       </div>
       <div>
          <h2 class = "font-bold">${video.title}</h2>
          <div class = "flex gap-2 items-center">
            <p class = "text-gray-400">${video.authors[0].profile_name}</p>
          
            ${video.authors[0].verified == true ? '<img class = "w-5" src = "https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png">':''}

          </div>
          <p> <button onclick = "loadDetails('${video.video_id}')" class = "btn btn-sm btn-error">Details</button> </p>
       </div>
    </div>
    `;

    videosContainer.append(card);
  });
};

// category: "Music";
// category_id: "1001";

// show category-wise video after pressing buttons
let loadCategoryVideos = (id) => {

    // alert(id);
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();

      let activeButton = document.getElementById(`btn-${id}`);
      activeButton.classList.add("active");
      displayVideos(data.category);
    })
    .catch((error) => console.log(error));
}
const removeActiveClass = () => {
   let buttons = document.getElementsByClassName('btn-category');
  //  console.log(buttons);
  for(let btn of buttons){
     btn.classList.remove("active");
  }
}

//creating DisplayCatagories
const DisplayCatagories = (categories) => {
  const categoryContainer = document.getElementById("categories");
  categories.forEach((item) => {
    console.log(item);

    //creating a button div
    const buttonContainer = document.createElement("div");
   
    buttonContainer.innerHTML = `
       <button id = "btn-${item.category_id}" onclick = "loadCategoryVideos(${item.category_id})" class = "btn btn-category">
           ${item.category}
       </button>
    `;
    
    // add btn to category
    categoryContainer.append(buttonContainer);
  });
};

document.getElementById('search-input').addEventListener('keyup', (e) => {
  loadVideos(e.target.value);
})

loadCatagories();
loadVideos();

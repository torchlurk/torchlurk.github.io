let rects = document.querySelectorAll("rect");
let texts = document.querySelectorAll("text");









/* SELECTION OF "ALL" THE HTML ELEMENTS*/
let titelFilter = document.querySelector(".titel-filter");

let gridContainer = document.querySelector(".grid-container");

let closeX = document.querySelector(".close-div");
let modalContainer = document.querySelector(".modal-container");
let contentWrapper = document.querySelector(".content-wrapper");

let favImgsDivFirst = document.querySelector(".avg_imgs-firstRow");
let favImgsDivSecond = document.querySelector(".avg_imgs-secondRow");

let gradPathAvgDivFirst = document.querySelector(".avg_imgs_grad-firstRow");
let gradPathAvgDivSecond = document.querySelector(".avg_imgs_grad-secondRow");

let maxImgsDivFirst = document.querySelector(".max_imgs-firstRow");
let maxImgsDivSecond = document.querySelector(".max_imgs-secondRow");

let gradPathMaxDivFirst = document.querySelector(".max_imgs_grad-firstRow");
let gradPathMaxDivSecond = document.querySelector(".max_imgs_grad-secondRow");

let actmaxImDiv = document.querySelector(".actmax_img");
let maxCropDivFirst = document.querySelector(".max_imgs_crop-firstRow");
let maxCropDivSecond = document.querySelector(".max_imgs_crop-secondRow");

let maxGradCropDivFirst = document.querySelector(".max_imgs_crop_grad-firstRow");
let maxGradCropDivSecond = document.querySelector(".max_imgs_crop_grad-secondRow");


let favCatHistogram = document.querySelector(".favCatHistogram");
let favHistogram = document.querySelector(".favHistogram");
let maxCatHistogram = document.querySelector(".maxCatHistogram");
let maxHistogram = document.querySelector(".maxHistogram");

let overlay = document.querySelector(".overlay");
/*function displayContent(displayClassName){ //appele depuis HTML
let selectedDisplay = document.querySelector("."+ displayClassName);
selectedDisplay.classList.toggle("unClicked");
} */

/* ONCE THE SWIPER IS LOADED, THE JSON IS STORED IN THE VARIABLE jsonData FOR FUTURE USE*/
let jsonData = [];

let json1 = [];
let json2 = [];
let json_concat = [];

$.getJSON("../vgg16_imagenet_1.json", function(jsono) {
  json1 = jsono;
  $.getJSON("../vgg16_imagenet_2.json", function(json) {
    json2 = json
    json_concat = json1.concat(json2);
    console.log("coucou")
    console.log(json_concat)
    test(json_concat)
  });
});

//test(json_concat)
/*
$.getJSON("../vgg16_imagenet_2.json", function(json){
  test(json)
});
*/
/*
$.getJSON("../vgg16_imagenet_1.json", function(jsono) {
  test(json)
});
*/

////1: creation of the swiper with the corresponding layers////
function test(json) { //../vgg16_imagenet.json //

  jsonData = json;
  console.log(jsonData)
  console.log("json charge");
  rects.forEach( el =>  {
    el.style.cursor = "pointer";
    el.addEventListener("mouseover",function(e){
      e.target.style.fill = "orange";

    });
    el.addEventListener("mouseout",function(e){
      e.target.style.fill = "white";

    });
    el.addEventListener("click",function(e){
        gridContainer.innerHTML = "";
        titelFilter.innerHTML = "";
        let layerIdString = e.target.dataset.layerId;
        let layerId = parseInt(layerIdString);
        //console.log(json);
        //console.log(jsonData[layerId].filters);
        if(jsonData[layerId].filters != undefined) { // condition for RELU layers
            drawGridContainer(layerId);
        }
});

});



/*
texts.forEach( el =>  {
    el.style.cursor = "pointer";

    el.addEventListener("mouseover",function(e){
      console.log(e.target.dataset.layerId);
      let layerId = e.target.parentElement.dataset.layerId;

      let rect = document.querySelector(`rect[data-layer-id = ${layerId}]`);
      rect.style.fill = "orange";

    });




    el.addEventListener("click",function(e){
        gridContainer.innerHTML = "";
        titelFilter.innerHTML = "";
        console.log("text: layer ->"+ el.dataset.layerId);
        console.log(e.target);
        let textNode = e.target.parentElement;
        console.log(textNode);
        let layerIdString = textNode.dataset.layerId;
        let layerId = parseInt(layerIdString);
        if(json[layerId].filters != undefined){ // condition for RELU layers
            drawGridContainer(layerId);
            }

    });

});
*/
};// end of get Json for swiper

//test(json_concat);




/* drawGridContainer draws the grid of squares (each unit of the chosed layer).
each unit has a data-layer-ID and data-filter-Id attribute*/
function drawGridContainer(layerId){
  //titelFilter.innerHTML ="choose your filter";
  console.log(jsonData[layerId]);
  let filters = jsonData[layerId].filters;
  let filterNumber = filters.length;
  let colRowNumber = Math.ceil(Math.sqrt(filterNumber));
  let a = gridContainer.getBoundingClientRect().width;
  //gridContainer.style.gridTemplateColumns = `repeat(${colRowNumber}, ${a/colRowNumber}px) `;
  //gridContainer.style.gridTemplateRows = `repeat(${colRowNumber}, ${a/colRowNumber}px)`;
  let i = 0; // compteur pour n'avoir que 64 units
  filters.forEach(filter => {
    if( i < 64){
  let gridItem = document.createElement("div");
  gridItem.classList.add("griditem");
  gridItem.setAttribute("data-layer-id",`${layerId}`);
  gridItem.setAttribute("data-filter-id",`${filter.id}`);
  gridItem.innerHTML = `<span class="unitNumber" data-layer-id = "${layerId}" data-filter-id = "${filter.id}" >unit ${filter.id}</span>`;
  gridItem.style.backgroundImage = `url(.${filter.filter_viz})`; // met les filter_VIZ !
  gridContainer.appendChild(gridItem);
  }
  i += 1;
  });
  }

  /*modalAppearance creates the popup by using the fuction called "createModal" and then scale the popUp from 0 to 1
  it is used as a callback fuction for the ONCLICK EVENT*/
  let modalAppearance = function(e){
    let layerId = parseInt(e.target.dataset.layerId);
    let filterId = parseInt(e.target.dataset.filterId);
    if((filterId == undefined || isNaN(filterId)) || (layerId == undefined || isNaN(layerId))){
      console.log("apuie sur un carré connard, pas entre deux...");
      return;
    } else{
       console.log(layerId,filterId);
       createModal(layerId,filterId);
       modalContainer.classList.add("active"); //scale from 0 to 1
       overlay.classList.add("active");
    }
  }
// ONCLICK EVENT
gridContainer.addEventListener("click", modalAppearance);
gridContainer.addEventListener("dblclick", function(e){
  console.log(e.cancelable);
});


// la fct createModal crée la popUp en lui donnant comme attribut les data-layerId et data-filterId du carré clické et rajoute un titre ,une description,les images et les histos
function createModal(layerId,filterId){
  console.log(jsonData[layerId])
  let filter = jsonData[layerId].filters[filterId];
  modalContainer.setAttribute("data-layer-id",`${layerId}`);
  modalContainer.setAttribute("data-filter-id",`${filterId}`);

  /**display content avg_imgs-display**/
  // displayTitel = histo_counts_avg
  //histo_counts_avg-description  -> Mentha
  // favCatHistogram -> dessiner histogram !!! :))) DELAY
  console.log(document.body.clientWidth);
  let windowWidth = document.body.clientWidth;
  drawHistos("favCatHistogram",filter.histo_counts_avg,windowWidth*0.6, 1000,1000);


  // displayTitel avg_imgs
  //avg_imgs-description -> Mentha
  //avg_imgs
  let ifav = 0;
  for(el of filter.avg_imgs){

    let im = document.createElement("img");
    im.src = el;
    if(ifav < 4){
    favImgsDivFirst.appendChild(im);
    }else{
    favImgsDivSecond.appendChild(im);
    }
    ifav += 1;
 }
  // displayTitel avg_imgs_grad
  //avg_imgs_grad-description -> Mentha
  //avg_imgs_grad
  let igrad = 0;
  for(el of filter.avg_imgs_grad){
      let im = document.createElement("img");
      im.src = el;
      if(igrad < 4){
        gradPathAvgDivFirst.appendChild(im);
        }else{
        gradPathAvgDivSecond.appendChild(im);
        }
        igrad += 1;
    }
  //avg_imgs_histo-description -> mentha
  //favHistogram -> dessiner Histogram !!! .))) DELAY
  drawHistos("favHistogram",filter.avg_spikes,windowWidth*0.6,1000,1000);

  /**displayContent max_imgs-display**/
  //histo_counts_max-description -> mentha
  //maxCatHistogram à dessiner !!! :))) DEALY
  //draw the histo with the 10 categ max
  drawHistos("maxCatHistogram",filter.histo_counts_max,windowWidth*0.6,1000, 1000);


    /// addition of an eventListener for resizing the graphs
  //max_imgs titel
  //max_imgs-description -> Mentha
  //max_imgs
  let imax = 0;
    for(el of filter.max_imgs){
       let im = document.createElement("img");
       im.src = el;
       if(imax < 4){
        maxImgsDivFirst.appendChild(im);
        }else{
        maxImgsDivSecond.appendChild(im);
        }
        imax += 1;

    }

// maxCropDiv

let icrop = 0;
for(el of filter.max_imgs_crop){
   let im = document.createElement("img");
   im.src = el;
   if(icrop < 4){
    maxCropDivFirst.appendChild(im);
    }else{
    maxCropDivSecond.appendChild(im);
    }
    icrop += 1;

}


  //max_imgs_grad titel
  //max_imgs_grad-description -> mentha
  //max_imgs_grad
  let imaxgrad = 0;
    for(el of filter.max_imgs_grad){
       let im = document.createElement("img");
       im.src = el;
       if(imaxgrad < 4){
        gradPathMaxDivFirst.appendChild(im);
        }else{
        gradPathMaxDivSecond.appendChild(im);
        }
        imaxgrad += 1;

    }


  // crop of maxGrad

  let icropMaxGrad = 0;
  for(el of filter.max_imgs_crop_grad){
     let im = document.createElement("img");
     im.src = el;
     if(icropMaxGrad < 4){
      maxGradCropDivFirst.appendChild(im);
      }else{
      maxGradCropDivSecond.appendChild(im);
      }
      icropMaxGrad += 1;

  }







    //max_imgs_histo-description -> mentha
    //maxHistogram a dessiner !!! :))) DELAY
    drawHistos("maxHistogram",filter.max_spikes, windowWidth*0.6,1000,1000);


    /**displayContent actmax_img-display**/
    //actmax_img
    //actmax_img-description -> mentha
    //actmax_img
    let im = document.createElement("img");
       im.src = filter.filter_viz;
       actmaxImDiv.appendChild(im);
 /* for Yann mentha later...
   avg_imgs-description
   avg_imgs_grad-description
   avg_imgs_histo-description
   max_imgs-description
   max_imgs_grad-description
   max_imgs_histo-description
   actmax_img-description
   histo_counts_avg-description
   histo_counts_max-description
   */
let descrs = document.querySelectorAll(".description")
descrs.forEach( el => el.innerHTML = "lorem industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.");
}


/* fonction qui supprime l'intérieur du popUp avant qu'il ne se ferme */

closeX.addEventListener("click",function(){
  eraseModal();
  modalContainer.classList.remove("active");
  overlay.classList.remove("active");
 });

function eraseModal(){
  modalContainer.setAttribute("data-layer-id","");
  modalContainer.setAttribute("data-filter-id","");

  let images = document.querySelectorAll(".images");
  let histos = document.querySelectorAll(".histo");
  let descriptions = document.querySelectorAll(".description");
  images.forEach(el => el.innerHTML ="");
  histos.forEach(el => el.innerHTML ="");
  descriptions.forEach(el => el.innerHTML ="");
}



/* fonction qui dessine un histo. il faut lui donner la width du svg , le retard, l'effet et un OBJET(CAT/SPIKES) OU UN ARRAY(SPIKES)*/
// on pourra jouer sur la Height du graph fixée ici a 500, et les margins + text-size
function drawHistos(CanvasClassName,ArraySpikesOrCategObj,svgWidth = 500, duration = 1000,delay = 1000,categNumber = 10){
  let rotate = 0;
  let textAnchor;
  let dataArray = [];
  let categoryNames = [];
  if(Array.isArray(ArraySpikesOrCategObj)){
    dataArray = ArraySpikesOrCategObj;
    for(let i = 1; i <= ArraySpikesOrCategObj.length;i++ ){
      categoryNames.push(i.toString());
    }
    textAnchor = "middle";

  }else{
    let icategNumber = 0;
    let categObj = ArraySpikesOrCategObj;
    for (name in categObj){
      categoryNames.push(name);
      dataArray.push(categObj[name]);
      icategNumber += 1;
      if (icategNumber >= categNumber) break;
    }
    rotate = -40;
    textAnchor = "end";

  }

  let dataArray0 = dataArray.map(el=> {if (el <= 0) {return 0;}else{return parseFloat(el.toFixed(2));}});
  console.log(dataArray0);
  let htmlCanvas = document.querySelector("."+CanvasClassName);

  //htmlCanvas.innerHTML ="";
  // create a svg, give a class name to the svg element and give dimensions
  let canvas = d3.select("."+CanvasClassName);
  let svg = canvas.append("svg")
          .attr("width",svgWidth)
          .attr("height",500)
          .attr("class", CanvasClassName+"Svg");

  let htmlSvg = document.querySelector("."+CanvasClassName+"Svg");

  //let svgWidth = htmlSvg.getBoundingClientRect().width;
  //if(svgWidth == 0){ svgWidth = 900;}
  let svgHeight = 500;
  let margin = { left: 50, right:20, top:20,bottom:120};
  let barsGroupWidth = svgWidth-margin.left-margin.right; //**
  let barsGroupHeight = svgHeight-margin.top-margin.bottom;
  let barsGroup = svg.append("g")//
                      .attr("width",barsGroupWidth)
                     .attr("height",barsGroupHeight)
                     .attr("transform",`translate(${margin.left},${margin.top})`);
  // crée les groupes pour les axes
  let xAxisGroup = barsGroup.append("g");
  let yAxisGroup = barsGroup.append("g");
  // crée les bars suivant les données dans la place pour le graphe

  let rects = barsGroup.selectAll("rect").data(dataArray0); // cette ligne est cruciale !! et le selectAll aussi !!!

  let y = d3.scaleLinear().domain([0,d3.max(dataArray0)]).range([barsGroupHeight,0]);//à corriger en dernier ! [0,barsGroupHeight] -> [barsGroupHeight,0]
  let x = d3.scaleBand().domain(categoryNames).range([0,barsGroupWidth])
  .paddingInner(0.2).paddingOuter(0.2); // le Banderange est Hardcode... , il manque padding inner outer



  let forFutureUse = rects.enter()
                          .append("rect")
                          .attr("x", (d,i,n) => x(categoryNames[i]))
                          .attr("width",x.bandwidth()) // la width = Bandrange/#bars = x.bandwidth() :))
                          .attr("fill", "#3ee7ad")
                          .attr("height", 0) // POS INIT TRANSIT
                          .attr("y",barsGroupHeight)//POS INIT TRANSIT
                          .transition().duration(duration).delay(delay)
                              .attr("y",d => y(d)) //= .attr("transform",d => `translate(${0},${y(d)})`); // à corriger en dernier ! (rajouter) //POS INIT FOR TRANS
                              .attr("height", d => barsGroupHeight-y(d));// à corriger en dernier ! d => y(d) -> d => barsGroupHeight-y(d)//POS INIT FOR TRANS

  let xAxis = d3.axisBottom(x);
  let yAxis = d3.axisLeft(y);
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
  xAxisGroup.attr("transform",`translate(${0},${barsGroupHeight})`); // so that the axis is downward
  xAxisGroup.selectAll("text").attr("transform",`rotate(${rotate})`)
                              .attr("text-anchor", textAnchor);
  }

  window.addEventListener("resize",function(e){
    //on resize all the histograms have to be redrawn
    if(modalContainer.getBoundingClientRect().width =!0){
    let windowWidth = document.body.clientWidth;
    let layerId = parseInt(modalContainer.dataset.layerId);
    let filterId = parseInt(modalContainer.dataset.filterId);
    console.log(layerId,filterId);
    let filter = jsonData[layerId].filters[filterId];
    console.log(filter);
    console.log(windowWidth);
    favCatHistogram.innerHTML ="";
    favHistogram.innerHTML = "";
    maxCatHistogram.innerHTML ="";
    maxHistogram.innerHTML ="";

      drawHistos("favCatHistogram",filter.histo_counts_avg,windowWidth*0.6, 0,0);
      drawHistos("favHistogram",filter.avg_spikes,windowWidth*0.6,0,0);
      drawHistos("maxCatHistogram",filter.histo_counts_max,windowWidth*0.6,0,0);
      drawHistos("maxHistogram",filter.max_spikes, windowWidth*0.6,0,0);


    }
    });

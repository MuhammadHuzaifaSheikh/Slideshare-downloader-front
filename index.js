
let input = document.querySelector('input');
let button = document.querySelector('.button')
const baseUrl = 'https://slideshare-article-downloader.herokuapp.com';
 let pdfBtn =      button.firstElementChild;
pdfBtn.innerHTML="PDF";
let pptBtn = pdfBtn.nextElementSibling;
pptBtn.innerHTML= 'PPT';

let images = [];
function getHtml() {
    pdfBtn.innerHTML= `
     <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
    `
    pptBtn.innerHTML= `
     <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
    `

    images= []
    var requestOptions = {
        method: 'POST',
        body: JSON.stringify({siteUrl:input.value}),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };

    fetch(baseUrl+"/sendLink", requestOptions)
        .then(response => response.text())
        .then(result => {
            let htmlString = result;
            let htmlEle = new DOMParser().parseFromString(htmlString, "text/html");
            let slide_container =  htmlEle.body.querySelectorAll('.slide_container>section>img')
          if (slide_container.length>0){
              getAllSlides(slide_container)
          }
          else {
              alert('Cannot download the file');
              pptBtn.innerHTML= 'PPT';
              pdfBtn.innerHTML= 'PDF';

          }
        })
        .catch(error => console.log('error', error));

}


function getAllSlides(slide_container) {
    slide_container.forEach((image)=>{
        images.push(image.src)
    })
    PdfGenerator(images)
    pptBtn.innerHTML= 'PPT';
    pdfBtn.innerHTML= 'PDF';
}


function PdfGenerator(images) {
    printJS({
        printable: images,
        type: 'image',
        showModal: true, // Optional
        modalMessage: 'Printing Images...', // Optional
        style: ['@page { size: A4; margin: 0mm;} body {margin-top: 0;}  img { width:100%}'],
        targetStyles: ['*']
    }
    );

}





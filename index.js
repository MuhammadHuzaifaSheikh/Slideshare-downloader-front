let input = document.querySelector('input');
let button = document.querySelector('.button')
const baseUrl = 'https://slideshare-article-downloader.herokuapp.com';
let pdfBtn = button.firstElementChild;
pdfBtn.innerHTML = "PDF";
let pptBtn = pdfBtn.nextElementSibling;
pptBtn.innerHTML = 'PPT';

let images = [];

function getHtml() {
    pdfBtn.innerHTML = `
     <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
    `
    pptBtn.innerHTML = `
     <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
    `

    images = []
    var requestOptions = {
        method: 'POST',
        body: JSON.stringify({siteUrl: input.value}),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };

    fetch(baseUrl + "/sendLink", requestOptions)
        .then(response => response.text())
        .then(result => {
            let htmlString = result;
            let htmlEle = new DOMParser().parseFromString(htmlString, "text/html");
            let slide_container = htmlEle.body.querySelectorAll('.slide_container>section>img')
            if (slide_container.length > 0) {
                getAllSlides(slide_container)
            } else {
                alert('Cannot download the file');
                pptBtn.innerHTML = 'PPT';
                pdfBtn.innerHTML = 'PDF';

            }
        })
        .catch(error => console.log('error', error));

}


function getAllSlides(slide_container) {
    slide_container.forEach((image) => {
        images.push(image.src + '.jpeg')
    })
    console.log(images);
    getBase64Staring(images)

}



function getBase64Staring(images) {
    fetch(baseUrl + '/makeBase64String', {
        method: "POST",
        body: JSON.stringify({images}),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }).then((data) => {
        data.json().then((response) => {
            console.log(response);
            pdfGenerator(response.result)
        })
    }).catch((err) => {
        console.log(err);
    })


}


function pdfGenerator(images) {
    pdfBtn.innerHTML = `PDF`;
    pptBtn.innerHTML = `PPT`;

    var doc = new jsPDF('landscape')
    images.forEach((base64Strings)=>{
        doc.addImage(base64Strings, 'JPEG', 0, 0, 300, 220)
        doc.addPage('a4', 'landscape')
    })

    doc.save()

}

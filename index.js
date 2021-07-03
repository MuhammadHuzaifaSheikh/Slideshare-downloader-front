let input = document.querySelector('input');
let button = document.querySelector('.button')
// https://slideshare-article-downloader.herokuapp.com/
// http://localhost:5000
const baseUrl = 'https://slideshare-article-downloader.herokuapp.com';
let pdfBtn = button.firstElementChild;
pdfBtn.innerHTML = "PDF";
let pptBtn = pdfBtn.nextElementSibling;
pptBtn.innerHTML = 'PPT';

let images = [];

function getHtml(format) {
    if (format==='pdf'){
        pdfBtn.innerHTML = `
     <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
    `
    }
    else {
        pptBtn.innerHTML = `
     <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
    `
    }



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
                getAllSlides(slide_container,format)
            } else {
                alert(`Cannot download the ${format} file`);
                pptBtn.innerHTML = 'PPT';
                pdfBtn.innerHTML = 'PDF';

            }
        })
        .catch(error => console.log('error', error));

}


function getAllSlides(slide_container,format) {
    slide_container.forEach((image) => {
        images.push(image.getAttribute('data-full') + '.jpeg')
    })
        getBase64Staring(images,format)


}



function getBase64Staring(images,format) {
    fetch(baseUrl + '/makeBase64String', {
        method: "POST",
        body: JSON.stringify({images}),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }).then((data) => {
        data.json().then((response) => {
            if (format==='pdf'){
                pdfGenerator(response.result)
            }
            else pptGenerator(response.result)
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
   doc.deletePage(images.length+1)
    doc.save(`${input.value.replace('https://www.slideshare.net/','')}.pdf`)
}


function pptGenerator(images) {
    let pres = new PptxGenJS();
// 2. Add a Slide
    images.forEach((url)=>{
        let slide = pres.addSlide();
        // slide.addImage({ data:url,  sizing: {
        //         type:'cover',
        //         h: 1.5 ,
        //         w:3,
        //     } });
        slide.background = {data:url};

    })

    pdfBtn.innerHTML = `PDF`;
    pptBtn.innerHTML = `PPT`;

// 4. Save the Presentation
    pres.writeFile({ fileName: `${input.value.replace('https://www.slideshare.net/','')}.pptx` });
}


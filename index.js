




function getHtml() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://localhost:5000/sendLink", requestOptions)
        .then(response => response.text())
        .then(result => {
            let xmlString = result;
            let htmlEle = new DOMParser().parseFromString(xmlString, "text/html");
            let slide_container =  htmlEle.body.querySelector('.slide_container')
            getAllSlides(slide_container)
        })
        .catch(error => console.log('error', error));

}


function getAllSlides(slide_container) {
    // let images = [];
    for (let i = 0 ; i<slide_container.childElementCount;i++){
        let a = slide_container.querySelector('section').getAttribute("data-index")
        console.log(a);

    }
    // console.log(slide_container);

}
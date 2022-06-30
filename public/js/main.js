const deleteText = document.querySelectorAll('.fa-trash')
const thumbText = document.querySelectorAll('.fa-thumbs-up')
// const thumbText = document.querySelectorAll('.gabi')
Array.from(deleteText).forEach((element)=>{
    element.addEventListener('click', deleteEmployee)
})

Array.from(thumbText).forEach((element)=>{
    element.addEventListener('click', addLike)
})

async function deleteEmployee(){
    const eName = this.parentNode.childNodes[1].innerText
    const eSuggestion = this.parentNode.childNodes[3].innerText
    try{
        const response = await fetch('deleteEmployee', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'employeeNameS': eName,
              'employeeSuggestionS': eSuggestion
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function addLike(){
    const eName = this.parentNode.childNodes[1].innerText
    const eSuggestion = this.parentNode.childNodes[3].innerText
    const tLikes = Number(this.parentNode.childNodes[5].innerText)
    try{
        const response = await fetch('addOneLike', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'employeeNameS': eName,
              'employeeSuggestionS': eSuggestion,
              'likesS': tLikes
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
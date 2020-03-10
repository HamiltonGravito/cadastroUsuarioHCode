class UserController {

    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        /*Retorna todos os campos que possuem o atributo name
        let fields = document.querySelectorAll("#form-user-create [name]");*/
    }

    onSubmit(){

        //Obs.: Caso seja criado uma função do tipo "function(){}" o this interno fará referência a ela, enquanto, usando arrow function não.
        //Obs.: Quando a arrow function só tem um parâmetro ela não precisa de parentêses.
        this.formEl.addEventListener('submit', event =>{
            event.preventDefault();
            let values = this.getValues();

            //O metodo getPhotos retorna uma promise que se caso resolve realiza a primeira função e caso reject realiza a segunda
            this.getPhotos().then(
                (content) => {
                    values.photo = content;
                    this.addLine(values);
                },
                (e) => {
                    console.error(e);
                }

            );
        
        });
    }//Fechando onSubmit


    getPhotos(){

        //Como a promise é uma classe ela deve ser instanciada 'new'
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            //Filter retorna um array de acordo com os filtros
            let elements =  [...this.formEl.elements].filter(item => {
                if(item.name === "photo"){
                    return item;
                }
                
            });
    
            //Arquivo Carregado ".files[0]" porque esse arquivo retornado tbm pode ser uma coleção
            let file = elements[0].files[0];
    
            if(file){
            //Lê o arquivo e depois passa para a função onLoad()
            fileReader.readAsDataURL(file);
            }else {
               resolve('dist/img/boxed-bg.jpg');
            }
    
            //Chamado assim que o arquivo é carregado, transforma em base 64 com a função de callback que retorna o conteudo do arquivo
            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            FileReader.onerror = (e)=>{
                reject(e);
            }
        });

       
    }

    getValues(){

        let user = {};

   //Percorre os elementos do formulário usando "Spread ..." transforma uma coleção em um array [] e ... pecorre todos os indices. 
   [...this.formEl.elements].forEach(function(field, index) {
            if(field.name === "gender"){
                if(field.checked){
                    user[field.name] = field.value;
                }
               
            } else if(field.name == "admin"){
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        });

        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);
    }//Fechando getValues

    addLine(dataUser) {

       let tr = document.createElement('tr');
       
        tr.innerHTML = 
    `       <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
            <td>${dataUser.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>`;

        this.tableEl.appendChild(tr);
    }//Fecha addLine

}//Fecha Classe
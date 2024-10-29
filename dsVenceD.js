function defineStructure() {
    addColumn("VD_CODIGO"); 
	addColumn("VD_NOME"); 
    addColumn("VD_EMAIL"); 
    addColumn("VD_VENCIMENTO"); 
    addColumn("VD_NUMTITULO");
    addColumn("VD_PARCELA"); 
    addColumn("VD_VALOR"); 
    addColumn("VD_PRODUTO");
    addColumn("VD_NUMERO1");
    addColumn("VD_NUMERO2");
    addColumn("VD_NUMERO3");


    setKey([ "VD_NOME", "VD_CODIGO",  "VD_EMAIL","VD_VENCIMENTO","VD_PARCELA","VD_VALOR","VD_PRODUTO"]);
    addIndex([ "VD_NOME", "VD_CODIGO",  "VD_EMAIL" ]);
    addIndex([ "VD_NOME" ]);
    addIndex([ "VD_CODIGO", "VD_NOME"]);
    addIndex([ "VD_PRODUTO"]);
}
function onSync(lastSyncDate) {
    var dataset = DatasetBuilder.newDataset(); 
    var dataset2 = DatasetFactory.getDataset("dsVenceD", null, null, null); // busca o dataset completo
    if(dataset2 != null && dataset2.rowsCount > 0){ //se o dataset tem registros 
        log.info("MEULOG INFO DELETE ->"+dataset2.getValue(0, 'VD_NOME'))
        for (i = 0; i < dataset2.rowsCount; i++){ // para cada linha retornada no seu dataset .
        dataset.deleteRow([
            dataset2.getValue(i, 'VD_CODIGO'), 
            dataset2.getValue(i, 'VD_NOME'),
            dataset2.getValue(i, 'VD_EMAIL'), 
            dataset2.getValue(i, 'VD_VENCIMENTO'), 
            dataset2.getValue(i, 'VD_NUMTITULO'),
            dataset2.getValue(i, 'VD_PARCELA'), 
            dataset2.getValue(i, 'VD_VALOR'),  
            dataset2.getValue(i, 'VD_PRODUTO'),
            dataset2.getValue(i, 'VD_NUMERO1'),
            dataset2.getValue(i, 'VD_NUMERO2'),
            dataset2.getValue(i, 'VD_NUMERO3')
        ])
      }
    }   
    var clientService,data,vo,tit,i,j;     
    try{
        clientService = fluigAPI.getAuthorizeClientService();
        data = {
            companyId: getValue("WKCompany") + '',
            serviceCode: 'Protheus',
            endpoint: '/WSAVCLI/VENCED',
            method: 'get',// 'delete', 'patch', 'put', 'get'     
            timeoutService: '200', // segundos
            options: {
                encoding: 'UTF-8',
                mediaType: 'application/json',
                useSSL: true
            },
            headers: {
                ContentType: 'application/json;charset=UTF-8'
            }
        }
        vo = clientService.invoke(JSON.stringify(data));
        if (vo.getResult() == null || vo.getResult().isEmpty()) {
            log.info("Retorno está vazio");         
        }else{
            if( vo.getResult() != '{"Titulo":[]}' ){
                log.info('MEULOG INFO =>' + vo.getResult());
                tit = JSON.parse(vo.getResult());                    
                log.info('MEULOG INFO 2 =>' + tit.Titulo[0].NomeCliente);
                log.info('MEULOG INFO 3 =>' + tit.Titulo.length);
                
                for(j = 0; j < tit.Titulo.length; j++){
                    dataset.addOrUpdateRow([
                        tit.Titulo[j].CodigoCli,
                        tit.Titulo[j].NomeCliente,
                        tit.Titulo[j].EmailCliente,
                        tit.Titulo[j].Vencimento,
                        tit.Titulo[j].NumTitulo,
                        tit.Titulo[j].Parcela,
                        tit.Titulo[j].ValorParcela,
                        tit.Titulo[j].ProdutoCli,
                        tit.Titulo[j].NumeroCliente1,
                        tit.Titulo[j].NumeroCliente2,
                        tit.Titulo[j].NumeroCliente3
                    ])
                }
            }                    
        }
    }catch(e){
        log.info('MEULOG INFO E =>' + e)    
    }
    return dataset
}
function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset(); 
    dataset.addColumn("VD_CODIGO"); 
    dataset.addColumn("VD_NOME"); 
    dataset.addColumn("VD_EMAIL"); 
    dataset.addColumn("VD_VENCIMENTO"); 
    dataset.addColumn("VD_NUMTITULO"); 
    dataset.addColumn("VD_PARCELA"); 
    dataset.addColumn("VD_VALOR"); 
    dataset.addColumn("VD_PRODUTO");    
    dataset.addColumn("VD_NUMERO1");
    dataset.addColumn("VD_NUMERO2");
    dataset.addColumn("VD_NUMERO3");
    var clientService,data,vo,tit,i,cod; 
    cod = ''
    if( constraints != null){
        for (var i = 0; i < constraints.length; i++) {
            if (constraints[i].fieldName == "VD_CODIGO") { 
                cod = constraints[i].initialValue;
            }
        }
    }
    log.info("MEULOG INFO:" + cod)
    var dataset2 = DatasetFactory.getDataset("dsVenceD", null, null, null); // busca o dataset completo
    if(cod != '' ){
        for (let ind = 0; ind < dataset2.rowsCount; ind++) {
            if(dataset2.getValue(ind,"VD_CODIGO") == cod){
                dataset.addRow([
                    dataset2.getValue(ind,"VD_CODIGO"), 
                    dataset2.getValue(ind,"VD_NOME"), 
                    dataset2.getValue(ind,"VD_EMAIL"), 
                    dataset2.getValue(ind,"VD_VENCIMENTO"), 
                    dataset2.getValue(ind,"VD_NUMTITULO"), 
                    dataset2.getValue(ind,"VD_PARCELA"), 
                    dataset2.getValue(ind,"VD_VALOR"), 
                    dataset2.getValue(ind,"VD_PRODUTO"),
                    dataset2.getValue(ind,"VD_NUMERO1"),
                    dataset2.getValue(ind,"VD_NUMERO2"),
                    dataset2.getValue(ind,"VD_NUMERO3")                    
                ])
            }
        }
    }else{
        for (let ind = 0; ind < dataset2.rowsCount; ind++) {
            dataset.addRow([
                dataset2.getValue(ind,"VD_CODIGO"), 
                dataset2.getValue(ind,"VD_NOME"), 
                dataset2.getValue(ind,"VD_EMAIL"), 
                dataset2.getValue(ind,"VD_VENCIMENTO"), 
                dataset2.getValue(ind,"VD_NUMTITULO"), 
                dataset2.getValue(ind,"VD_PARCELA"), 
                dataset2.getValue(ind,"VD_VALOR"), 
                dataset2.getValue(ind,"VD_PRODUTO"),
                dataset2.getValue(ind,"VD_NUMERO1"),
                dataset2.getValue(ind,"VD_NUMERO2"),
                dataset2.getValue(ind,"VD_NUMERO3")                    
            ])
        }
    }
    return dataset
}

function onMobileSync(user) {

}
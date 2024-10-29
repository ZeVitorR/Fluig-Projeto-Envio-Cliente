function defineStructure() {
    addColumn("VB_CODIGO"); 
	addColumn("VB_NOME"); 
    addColumn("VB_EMAIL"); 
    addColumn("VB_VENCIMENTO"); 
    addColumn("VB_NUMTITULO");
    addColumn("VB_PARCELA"); 
    addColumn("VB_VALOR"); 
    addColumn("VB_PRODUTO");
    addColumn("VB_NUMERO1");
    addColumn("VB_NUMERO2");
    addColumn("VB_NUMERO3");


    setKey([ "VB_NOME", "VB_CODIGO",  "VB_EMAIL","VB_VENCIMENTO","VB_PARCELA","VB_VALOR","VB_PRODUTO"]);
    addIndex([ "VB_NOME", "VB_CODIGO",  "VB_EMAIL" ]);
    addIndex([ "VB_NOME" ]);
    addIndex([ "VB_CODIGO", "VB_NOME"]);
    addIndex([ "VB_PRODUTO"]);
}
function onSync(lastSyncDate) {
    var dataset = DatasetBuilder.newDataset(); 
    var dataset2 = DatasetFactory.getDataset("dsVenceB", null, null, null); // busca o dataset completo
    if(dataset2 != null && dataset2.rowsCount > 0){ //se o dataset tem registros 
        log.info("MEULOG INFO DELETE ->"+dataset2.getValue(0, 'VB_NOME'))
        for (i = 0; i < dataset2.rowsCount; i++){ // para cada linha retornada no seu dataset .
        dataset.deleteRow([
            dataset2.getValue(i, 'VB_CODIGO'), 
            dataset2.getValue(i, 'VB_NOME'),
            dataset2.getValue(i, 'VB_EMAIL'), 
            dataset2.getValue(i, 'VB_VENCIMENTO'), 
            dataset2.getValue(i, 'VB_NUMTITULO'),
            dataset2.getValue(i, 'VB_PARCELA'), 
            dataset2.getValue(i, 'VB_VALOR'),  
            dataset2.getValue(i, 'VB_PRODUTO'),
            dataset2.getValue(i, 'VB_NUMERO1'),
            dataset2.getValue(i, 'VB_NUMERO2'),
            dataset2.getValue(i, 'VB_NUMERO3')
        ])
      }
    }   
    var clientService,data,vo,tit,i,j;     
    try{
        clientService = fluigAPI.getAuthorizeClientService();
        data = {
            companyId: getValue("WKCompany") + '',
            serviceCode: 'Protheus',
            endpoint: '/WSAVCLI/VENCEB',
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
    dataset.addColumn("VB_CODIGO"); 
    dataset.addColumn("VB_NOME"); 
    dataset.addColumn("VB_EMAIL"); 
    dataset.addColumn("VB_VENCIMENTO"); 
    dataset.addColumn("VB_NUMTITULO"); 
    dataset.addColumn("VB_PARCELA"); 
    dataset.addColumn("VB_VALOR"); 
    dataset.addColumn("VB_PRODUTO");    
    dataset.addColumn("VB_NUMERO1");
    dataset.addColumn("VB_NUMERO2");
    dataset.addColumn("VB_NUMERO3");
    var clientService,data,vo,tit,i,cod; 
    
    cod = ''
    if( constraints != null){
        for (var i = 0; i < constraints.length; i++) {
            if (constraints[i].fieldName == "VB_CODIGO") { 
                cod = constraints[i].initialValue;
            }
        }
    }
    log.info("MEULOG INFO:" + cod)
    var dataset2 = DatasetFactory.getDataset("dsVenceB", null, null, null); // busca o dataset completo
    if(cod != '' ){
        for (let ind = 0; ind < dataset2.rowsCount; ind++) {
            if(dataset2.getValue(ind,"VB_CODIGO") == cod){
                dataset.addRow([
                    dataset2.getValue(ind,"VB_CODIGO"), 
                    dataset2.getValue(ind,"VB_NOME"), 
                    dataset2.getValue(ind,"VB_EMAIL"), 
                    dataset2.getValue(ind,"VB_VENCIMENTO"), 
                    dataset2.getValue(ind,"VB_NUMTITULO"), 
                    dataset2.getValue(ind,"VB_PARCELA"), 
                    dataset2.getValue(ind,"VB_VALOR"), 
                    dataset2.getValue(ind,"VB_PRODUTO"),
                    dataset2.getValue(ind,"VB_NUMERO1"),
                    dataset2.getValue(ind,"VB_NUMERO2"),
                    dataset2.getValue(ind,"VB_NUMERO3")                    
                ])
            }
        }
    }else{
        for (let ind = 0; ind < dataset2.rowsCount; ind++) {
            dataset.addRow([
                dataset2.getValue(ind,"VB_CODIGO"), 
                dataset2.getValue(ind,"VB_NOME"), 
                dataset2.getValue(ind,"VB_EMAIL"), 
                dataset2.getValue(ind,"VB_VENCIMENTO"), 
                dataset2.getValue(ind,"VB_NUMTITULO"), 
                dataset2.getValue(ind,"VB_PARCELA"), 
                dataset2.getValue(ind,"VB_VALOR"), 
                dataset2.getValue(ind,"VB_PRODUTO"),
                dataset2.getValue(ind,"VB_NUMERO1"),
                dataset2.getValue(ind,"VB_NUMERO2"),
                dataset2.getValue(ind,"VB_NUMERO3")                    
            ])
        }
    }
    return dataset
}

function onMobileSync(user) {

}
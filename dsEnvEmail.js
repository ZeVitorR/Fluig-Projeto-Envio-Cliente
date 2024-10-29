function defineStructure() {
    addColumn("EE_DATA");
    addColumn("EE_CODCLI");
    addColumn("EE_CLIENTE");
    addColumn("EE_PRODUTOS");
    addColumn("EE_EMAIL");
    addColumn("EE_TIPO");
    addColumn("EE_RESPOSTA");

    setKey([ "EE_DATA", "EE_CODCLI", "EE_CLIENTE","EE_PRODUTOS","EE_EMAIL","EE_TIPO","EE_RESPOSTA"]);
    addIndex([ "EE_DATA"]);
    addIndex([ "EE_CLIENTE" ]);
}
function onSync(lastSyncDate) {
    var dataset = DatasetBuilder.newDataset();   

    var data = new Date()
    dia = parseInt(data.getDate())
	if(dia < 10){
		dia = '0'+dia;
	}
	mes = parseInt(data.getMonth()+1)
	if(mes < 10){
		mes = '0'+mes;
	}
	ano = data.getFullYear()
    var date = ''+dia+'/'+mes+'/'+ano

    log.info("Log do dataset sincronizado")
    //Array para envio com sucesso
    var Dados = new java.util.ArrayList(); 
    //Array para envio sem sucesso
    var DadosV = new java.util.ArrayList();
    //chamada para o dataset que titulo vence a 1 dia
    var dsVenceB = DatasetFactory.getDataset("dsVenceB", null, null, null);
    //chamada para o dataset que titulo venceu a 5 dia
    var dsVenceD = DatasetFactory.getDataset("dsVenceD", null, null, null);
    try{
        var codCli = '',nomes,quantidade
        quantidade = dsVenceB.rowsCount
        for(var i=0; i < quantidade; i++){
            if( dsVenceB.getValue(i, 'VB_EMAIL') != '' || dsVenceB.getValue(i, 'VB_EMAIL') != null){
                if (codCli != dsVenceB.getValue(i, 'VB_CODIGO')){
                    var parametros = new java.util.HashMap();
                    nomeCliente = dsVenceB.getValue(i, 'VB_NOME')
                    numTitulo = dsVenceB.getValue(i, 'VB_NUMTITULO')
                    parametros.put("NomeCliente", dsVenceB.getValue(i, 'VB_NOME'));
                   
                    var destinatarios = new java.util.ArrayList();  
                    destinatarios.add(dsVenceB.getValue(i, 'VB_EMAIL'))  
    
                    var mail = dsVenceB.getValue(i, 'VB_EMAIL')
    
                    nomes = ''
                    nomes += dsVenceB.getValue(i, 'VB_NOME')+' '
                    
                    codCli = dsVenceB.getValue(i, 'VB_CODIGO')
                    var constraints = new Array()
                    constraints.push(DatasetFactory.createConstraint("VB_CODIGO", codCli, codCli, ConstraintType.MUST));
                    var dsVenceB2 = DatasetFactory.getDataset("dsVenceB", null, constraints, null);
                    var prod = ''
                    var tits = new java.util.ArrayList();
                    for (let num = 0; num < dsVenceB2.rowsCount; num++) {
                        var tit = new java.util.HashMap();
                        prod += dsVenceB2.getValue(num, 'VB_VENCIMENTO')+' | '+dsVenceB2.getValue(num, 'VB_PRODUTO')+' | '+ dsVenceB2.getValue(num, 'VB_VALOR')+'\n'
                        nomes += 'total: '+dsVenceB2.rowsCount.toString()
                        var produto = dsVenceB2.getValue(num, 'VB_PRODUTO').split('-')
                        tit.put("Empreendimento", produto[2]);
                        tit.put("LoteQd", produto[0]+'/'+produto[1]);
                        tit.put("Vencimento", dsVenceB2.getValue(num, 'VB_VENCIMENTO'));
                        tit.put("Valor", dsVenceB2.getValue(num, 'VB_VALOR'));
                        tits.add(tit)
                        
                    }
                    
                    //Este parâmetro é obrigatório e representa o assunto do e-mail
                    
                    parametros.put("Mensagem", "Gostaríamos de lembrar que a sua parcela vence amanhã. Efetue o pagamento até o vencimento. Em caso de dúvida é só entrar em contato conosco.");
                    parametros.put("Titulos", tits);
                    parametros.put("subject", "Lembrete de Vencimento - Cliente: "+nomeCliente);
                    //Monta lista de destinatários
                    for (let index = 0; index < 1000100; index++) {
                        
                    }
                    notifier.notify("admin", "email_avisoCliente", parametros, destinatarios, "text/html");
                    dataset.addRow([
                        date,
                        codCli,
                        nomes,
                        prod,
                        mail,
                        'LEMBRETE',
                        'SUCESSO'
                    ])
                    var dadoI = new java.util.HashMap();
                    dadoI.put("dataEnvio", date);
                    dadoI.put("Codigo", codCli);
                    dadoI.put("Cliente", nomes);
                    dadoI.put("dadosCli", prod);
                    dadoI.put("local", mail);
                    dadoI.put("tipo", 'LEMBRETE');
                    dadoI.put("Resposta", 'SUCESSO');
                    Dados.add(dadoI)
                }
            }else{
                var dadoI = new java.util.HashMap();
                dadoI.put("Codigo", dsVenceB.getValue(i, 'VB_CODIGO'));
                dadoI.put("Cliente", dsVenceB.getValue(i, 'VB_NOME'));
                dadoI.put("Produtos", dsVenceB.getValue(i, 'VB_PRODUTO'));
                dadoI.put("data", date);
                dadoI.put("enderecoEnviado", dsVenceB.getValue(i, 'VB_EMAIL'));
                dadoI.put("tipo", 'LEMBRETE');
                dadoI.put("Resposta", 'ERRO');
                DadosV.add(dadoI)
            }
            codCli = dsVenceB.getValue(i, 'VB_CODIGO')
        }
        //envio dos emails dos titulos vencidos
        codCli = ''
        quantidade = dsVenceD.rowsCount
        for(var j = 0; j < quantidade; j++){
            if( dsVenceB.getValue(j, 'VD_EMAIL') != '' || dsVenceB.getValue(j, 'VD_EMAIL') != null){
                if (codCli != dsVenceD.getValue(j, 'VD_CODIGO')){
                    var parametros = new java.util.HashMap();
                    parametros.put("NomeCliente", dsVenceD.getValue(j, 'VD_NOME'));
                    nomeCliente = dsVenceD.getValue(j, 'VD_NOME')
                    numTitulo = dsVenceD.getValue(j, 'VD_NUMTITULO')
                    var tits = new java.util.ArrayList();        
                    var destinatarios = new java.util.ArrayList();  
                    destinatarios.add(dsVenceD.getValue(j, 'VD_EMAIL'))  
                    var mail = dsVenceD.getValue(j, 'VD_EMAIL');
                    nomes = ''
                    nomes += dsVenceD.getValue(j, 'VD_NOME')+' '
                    codCli = dsVenceD.getValue(j, 'VD_CODIGO')
                    var constraints = new Array()
                    constraints.push(DatasetFactory.createConstraint("VD_CODIGO", codCli, codCli, ConstraintType.MUST));
                    var dsVenceD2 = DatasetFactory.getDataset("dsVenceD", null, constraints, null);
                    var prod = ''
                    for (let num = 0; num < dsVenceD2.rowsCount; num++) {
                        var tit = new java.util.HashMap();
                        var produto = dsVenceD2.getValue(num, 'VD_PRODUTO').split('-')
                        prod += dsVenceD2.getValue(num, 'VD_VENCIMENTO')+' | '+ dsVenceD2.getValue(num, 'VD_PRODUTO')+' | '+dsVenceD2.getValue(num, 'VD_VALOR')+'\n'
                        nomes += 'total: '+dsVenceD2.rowsCount.toString()
                        tit.put("Empreendimento", produto[2]);
                        tit.put("LoteQd", produto[0]+'/'+produto[1]);
                        tit.put("Vencimento", dsVenceD2.getValue(num, 'VD_VENCIMENTO'));
                        tit.put("Valor", dsVenceD2.getValue(num, 'VD_VALOR'));
                        tits.add(tit)
                        
                    }
                    
                    //Este parâmetro é obrigatório e representa o assunto do e-mail
                    
                    parametros.put("Mensagem", "Até o momento não identificamos o pagamento da sua parcela, abaixo identificada. Caso pagamento já tenha sido efetuado, por favor desconsidere este aviso.");
                    parametros.put("Titulos", tits);
                    parametros.put("subject", "Aviso de Débito - Cliente: "+nomeCliente);
                    //Monta lista de destinatários
                    for (let index = 0; index < 1000100; index++) {
                        
                    }
                    notifier.notify("admin", "email_avisoCliente", parametros, destinatarios, "text/html");
                    dataset.addRow([
                        date,
                        codCli,
                        nomes,
                        prod,
                        mail,
                        'AVISO',
                        'SUCESSO'
                    ])
                    var dadoI = new java.util.HashMap();
                    dadoI.put("dataEnvio", date);
                    dadoI.put("Codigo", codCli);
                    dadoI.put("Cliente", nomes);
                    dadoI.put("dadosCli", prod);
                    dadoI.put("local", mail);
                    dadoI.put("tipo", 'AVISO');
                    dadoI.put("Resposta", 'SUCESSO');
                    Dados.add(dadoI)
                }
            }else{
                var dadoI = new java.util.HashMap();
                dadoI.put("Codigo", dsVenceB.getValue(j, 'VD_CODIGO'));
                dadoI.put("Cliente", dsVenceB.getValue(j, 'VD_NOME'));
                dadoI.put("dadosCli", dsVenceB.getValue(j, 'VD_PRODUTO'));
                dadoI.put("dataEnvio", date);
                dadoI.put("local", dsVenceB.getValue(j, 'VD_EMAIL'));
                dadoI.put("tipo", 'LEMBRETE');
                dadoI.put("Resposta", 'ERRO');
                DadosV.add(dadoI)
            }
            
            codCli = dsVenceD.getValue(j, 'VD_CODIGO')
        }
        var dado = new java.util.HashMap();
        dado.put("Codigo", ' ');
        dado.put("Cliente", ' ');
        dado.put("dadosCli", ' ');
        dado.put("dataEnvio", ' ');
        dado.put("local", ' ');
        dado.put("tipo", ' ');
        dado.put("Resposta", ' ');
        DadosV.add(dado) 

        var parametros = new java.util.HashMap();
        parametros.put("ENVIO","E-MAIL");
        parametros.put("DadosV",DadosV);
        parametros.put("Dados",Dados);
        parametros.put("envioTable",'e-mail');
        parametros.put("subject", "Envio de log de envio dos emails para os clientes");
        var destinatarios = new java.util.ArrayList();  
        destinatarios.add("tic@thcm.com.br") 
        destinatarios.add("financeiro@thcm.com.br") 
        notifier.notify("admin", "email_avisoLog", parametros, destinatarios, "text/html");


    }catch(e){
    	log.info("MEULOG INFO E->"+e)
    }
    
    return dataset

}
function createDataset(fields, constraints, sortFields) {    
    var dataset = DatasetBuilder.newDataset(); 

    dataset.addColumn("EE_DATA");
    dataset.addColumn("EE_CODCLI");
    dataset.addColumn("EE_CLIENTE");
    dataset.addColumn("EE_PRODUTOS");
    dataset.addColumn("EE_EMAIL");
    dataset.addColumn("EE_TIPO");
    dataset.addColumn("EE_RESPOSTA");

    
    var dataset2 = DatasetFactory.getDataset("dsEnvEmail", null, null, null); // busca o dataset completo
    if(constraints != null){
        for (var i = 0; i < constraints.length; i++) {
            if (constraints[i].fieldName == "EE_DATA") { 
                dataIni = ''+constraints[i].initialValue;
                dataFim = ''+constraints[i].finalValue;
            }else if (constraints[i].fieldName == "EE_CODCLI"){
                codIni = ''+constraints[i].initialValue;
                codFim = ''+constraints[i].finalValue; 
            }
        }
    }
    dataFim = (dataFim == '' || dataFim == null ) ?  dataIni : dataFim;
    codFim  =  (codFim == '' || codFim == null ) ?  codIni : codFim;

    if(dataset2.rowsCount > 0){
        for (let i = 0; i < dataset2.rowsCount; i++) {
            if((dataIni != null ||  dataIni != '') || ((codIni != null ||  codIni != ''))){
                var data1 = dataIni.split('/')
                var dataFmtIni = data1[3]+data1[2]+data1[1]
                var data2 = dataFim.split('/')
                var dataFmtFim = data2[3]+data2[2]+data2[1]
                var data3 = ''+dataset2.getValue(i, 'EE_DATA')
                data3 = data3.split('/')
                var dataFmtAtu = data3[3]+data3[2]+data3[1]
                var codAtu = parseInt(dataset2.getValue(i, 'EE_CODCLI'))
                codIni = parseInt(codIni)
                codFim = parseInt(codFim)
                if((dataFmtIni != null ||  dataFmtIni != '') && ((codIni != null ||  codIni != ''))){
                    
                    if((dataFmtAtu >= dataFmtIni && dataFmtAtu <= dataFmtFim) && (codAtu >= codIni && codAtu <= codFim) ){
                        dataset.addRow([
                            dataset2.getValue(i, 'EE_DATA'), 
                            dataset2.getValue(i, 'EE_CODCLI'),
                            dataset2.getValue(i, 'EE_CLIENTE'), 
                            dataset2.getValue(i, 'EE_PRODUTOS'), 
                            dataset2.getValue(i, 'EE_EMAIL'),
                            dataset2.getValue(i, 'EE_TIPO'), 
                            dataset2.getValue(i, 'EE_RESPOSTA')
                        ])
                    }
                }else if((dataFmtIni == null ||  dataFmtIni == '') && ((codIni != null ||  codIni != '')) ){
                    if(codAtu >= codIni && codAtu <= codFim) {
                        dataset.addRow([
                            dataset2.getValue(i, 'EE_DATA'), 
                            dataset2.getValue(i, 'EE_CODCLI'),
                            dataset2.getValue(i, 'EE_CLIENTE'), 
                            dataset2.getValue(i, 'EE_PRODUTOS'), 
                            dataset2.getValue(i, 'EE_EMAIL'),
                            dataset2.getValue(i, 'EE_TIPO'), 
                            dataset2.getValue(i, 'EE_RESPOSTA')
                        ])
                    }
                }else if((dataFmtIni != null ||  dataFmtIni != '') && ((codIni == null ||  codIni == '')) ){
                    if(dataFmtAtu >= dataFmtIni && dataFmtAtu <= dataFmtFim) {
                        dataset.addRow([
                            dataset2.getValue(i, 'EE_DATA'), 
                            dataset2.getValue(i, 'EE_CODCLI'),
                            dataset2.getValue(i, 'EE_CLIENTE'), 
                            dataset2.getValue(i, 'EE_PRODUTOS'), 
                            dataset2.getValue(i, 'EE_EMAIL'),
                            dataset2.getValue(i, 'EE_TIPO'), 
                            dataset2.getValue(i, 'EE_RESPOSTA')
                        ])
                    }
                }
            }else{
                dataset.addRow([
                    dataset2.getValue(i, 'EE_DATA'), 
                    dataset2.getValue(i, 'EE_CODCLI'),
                    dataset2.getValue(i, 'EE_CLIENTE'), 
                    dataset2.getValue(i, 'EE_PRODUTOS'), 
                    dataset2.getValue(i, 'EE_EMAIL'),
                    dataset2.getValue(i, 'EE_TIPO'), 
                    dataset2.getValue(i, 'EE_RESPOSTA')
                ])
            }                    
        }    
    }
    
    
    return dataset
}
function onMobileSync(user) {

}
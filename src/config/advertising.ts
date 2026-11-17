// Cole somente os valores do código oficial emitido para ESTE domínio.
// Não reutilize zonas de outro site. Sem configuração e consentimento, nada é carregado.
export const advertising: { enabled:boolean; scriptUrl:string; zoneId:string; verificationToken:string; adsTxtLines:string[] } = {
 enabled:false,
 scriptUrl:'',
 zoneId:'',
 verificationToken:'',
 adsTxtLines:[],
};
// In-Page Push é o formato preferido. Não adicionar popunder ou web-push por padrão.
// O domínio exato de scriptUrl deve ser aprovado no CSP de src/server.ts.
// Não colocar senhas ou tokens privados neste arquivo público.

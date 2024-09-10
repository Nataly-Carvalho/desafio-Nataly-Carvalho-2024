const recintos = [
    { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
    { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
    { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
    { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
    { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
  ];
  
  const animaisPermitidos = {
    LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
    LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
    CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
    MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
    GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
    HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
  };
  
  class RecintosZoo {
    analisaRecintos(animal, quantidade) {
      // Validação de animal e quantidade
      if (!animaisPermitidos[animal]) {
        return { erro: 'Animal inválido' };
      }
      
      if (quantidade <= 0 || !Number.isInteger(quantidade)) {
        return { erro: 'Quantidade inválida' };
      }
  
      const { tamanho, biomas, carnivoro } = animaisPermitidos[animal];
      const tamanhoTotal = tamanho * quantidade;
      
      // Filtra recintos viáveis
      const recintosViaveis = recintos
        .filter(recinto => this.isRecintoViavel(recinto, animal, quantidade, tamanhoTotal, carnivoro, biomas))
        .map(recinto => this.formatarRecinto(recinto, tamanhoTotal, animal));
  
      if (recintosViaveis.length === 0) {
        return { erro: 'Não há recinto viável' };
      }
  
      return { recintosViaveis };
    }
  
    isRecintoViavel(recinto, animal, quantidade, tamanhoTotal, carnivoro, biomas) {
      // Verifica se o bioma do recinto é compatível
      if (!biomas.some(bioma => recinto.bioma.includes(bioma))) {
        return false;
      }
  
      // Calcula o espaço já ocupado no recinto
      const ocupacaoAtual = recinto.animais.reduce((sum, { especie, quantidade }) => {
        const animalData = animaisPermitidos[especie];
        return sum + (animalData.tamanho * quantidade);
      }, 0);
  
      let espacoLivre = recinto.tamanho - ocupacaoAtual;
  
      // Aplica a regra do espaço extra se houver mais de uma espécie
      if (recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== animal)) {
        espacoLivre -= 1; // Espaço adicional ocupado quando há mais de uma espécie
      }
  
      // Verifica se há espaço suficiente
      if (espacoLivre < tamanhoTotal) {
        return false;
      }
  
      // Regra de carnívoros (não podem habitar com outras espécies)
      if (carnivoro && recinto.animais.length > 0) {
        return false;
      }
  
      // Regras adicionais para outros animais já no recinto
      return this.verificarConfortoAnimaisExistentes(recinto, animal, quantidade, carnivoro);
    }
  
    verificarConfortoAnimaisExistentes(recinto, animal, quantidade, carnivoro) {
      for (let { especie, quantidade: qtdExistente } of recinto.animais) {
        const animalExistente = animaisPermitidos[especie];
  
        // Carnívoros de espécies diferentes não podem coabitar
        if (animalExistente.carnivoro && especie !== animal) {
          return false;
        }
  
        // Hipopótamo só pode dividir espaço em "savana e rio"
        if (especie === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
          return false;
        }
  
        // Macaco precisa de companhia
        if (especie === 'MACACO' && qtdExistente === 1 && quantidade === 1 && recinto.animais.length === 1) {
          return false;
        }
      }
      return true;
    }
  
    formatarRecinto(recinto, tamanhoTotal, animal) {
      const ocupacaoAtual = recinto.animais.reduce((sum, { especie, quantidade }) => {
        const animalData = animaisPermitidos[especie];
        return sum + (animalData.tamanho * quantidade);
      }, 0);
  
      let espacoLivre = recinto.tamanho - ocupacaoAtual;
  
      // Aplica a regra do espaço extra se houver mais de uma espécie
      if (recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== animal)) {
        espacoLivre -= 1; // Espaço adicional ocupado quando há mais de uma espécie
      }
  
      return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre - tamanhoTotal} total: ${recinto.tamanho})`;
    }
  }
  
  export { RecintosZoo as RecintosZoo };
  
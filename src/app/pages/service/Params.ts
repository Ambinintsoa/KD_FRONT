// Enum pour l'ordre de tri (ascendant ou descendant)

  
  // Interface optimisée pour les paramètres de la liste
  export interface ListParams {
    page: number;           // La page courante (doit être >= 1)
    limit: number;          // Le nombre d'éléments à récupérer par page (doit être positif)
    search: string;         // Le terme de recherche (peut être une chaîne vide si pas de recherche)
    sortBy: string;    // Le champ par lequel trier les éléments
    orderBy: string;     // L'ordre du tri : ascendant ou descendant
  }

  
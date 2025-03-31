import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  common: {
    loading: "Loading...",
    remove: "Remove",
    cancel: "Cancel"
  },
  home: {
    title: "3D Ordinal Minter",
    subtitle: "Transform your 2D Ordinals into stunning 3D models and mint them on the BSV blockchain"
  },
  wallet: {
    connect: "Connect Wallet",
    disconnect: "Disconnect",
    connected: "Wallet Connected",
    connected_description: "Your wallet has been successfully connected.",
    disconnected: "Wallet Disconnected",
    disconnected_description: "Your wallet has been disconnected.",
    not_installed: {
      title: "Wallet Not Installed",
      description: "Yours Wallet extension is not installed. Please install it to continue.",
      message: "Yours Wallet extension is not installed in your browser.",
      install: "Install Yours Wallet"
    },
    visit_website: "Visit Website",
    error: {
      title: "Connection Error",
      description: "Failed to connect to wallet. Please try again.",
      disconnect_title: "Disconnect Error",
      disconnect_description: "Failed to disconnect wallet. Please try again."
    },
    modal: {
      title: "Connect Your Wallet",
      connect_yours: "Connect to your Yours Wallet",
      more_wallets: "More Wallets Coming Soon",
      coming_soon: "Additional wallet support planned"
    }
  },
  progress: {
    title: "Minting Process",
    network: "Network",
    mainnet: "Mainnet",
    steps: {
      connect: "Connect",
      upload: "Upload",
      preview: "Preview",
      mint: "Mint"
    }
  },
  upload: {
    title: "Upload Your Ordinal",
    description: "Select an existing Ordinal from your wallet to transform it into a 3D model. Only verified collection Ordinals are supported.",
    drag_drop: "Drag and drop your Ordinal, or browse from your wallet",
    connect_wallet_first: "Please connect your wallet to upload an Ordinal",
    supported_formats: "Supported formats: JPG, PNG, GIF, SVG",
    continue: "Continue to Preview",
    error: {
      invalid_type: {
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, GIF, SVG)."
      },
      validation: {
        title: "Validation Failed",
        description: "This Ordinal could not be validated. Make sure it belongs to a supported collection."
      },
      upload: {
        title: "Upload Failed",
        description: "There was an error uploading your Ordinal. Please try again."
      }
    }
  },
  collection: {
    title: "Collection Information",
    connect_wallet: "Connect Your Wallet",
    view_eligible: "To view your eligible collections",
    view_stats: "View collection stats below",
    stats: "Collection Stats",
    max_supply: "Max Supply",
    minted: "Minted",
    "3d_minted": "3D Minted",
    mint_fee: "Mint Fee"
  },
  viewer: {
    title: "3D Preview",
    connect_and_upload: "Connect wallet and upload an Ordinal to generate a 3D preview"
  },
  mint: {
    title: "Mint Your 3D Ordinal",
    generation_fee: "Generation Fee",
    network_fee: "Network Fee",
    total: "Total",
    button: "Mint 3D Ordinal",
    processing: "Processing...",
    terms_agreement: "By minting, you agree to our",
    terms_link: "Terms of Service",
    success: {
      title: "Minting Successful",
      description: "Your 3D Ordinal has been minted successfully."
    },
    error: {
      title: "Minting Failed",
      description: "There was an error minting your 3D Ordinal. Please try again."
    },
    status: {
      in_progress: "Minting in Progress",
      in_progress_description: "Your 3D Ordinal is being generated and inscribed to the BSV blockchain.",
      success: "Minting Successful!",
      success_description: "Your 3D Ordinal has been successfully minted to the BSV blockchain.",
      error: "Minting Failed",
      error_description: "There was an error while minting your 3D Ordinal. Please try again.",
      error_reason: "Error: Insufficient funds to complete transaction"
    },
    tx_id: "Transaction ID",
    tx_copy: "Copy",
    tx_view: "View on Explorer",
    tx_copied: "Transaction ID Copied",
    tx_copied_description: "Transaction ID has been copied to clipboard.",
    mint_another: "Mint Another Ordinal",
    try_again: "Try Again"
  },
  examples: {
    title: "Example 3D Ordinals",
    minted: "3D Minted",
    ago: "ago",
    ordinal_id: "Ordinal ID",
    view: "View",
    time: {
      day: "1 day",
      days: "{{count}} days",
      weeks: "{{count}} weeks",
      months: "{{count}} months"
    }
  },
  footer: {
    terms: "Terms",
    privacy: "Privacy",
    contact: "Contact",
    rights: "All rights reserved."
  }
};

// Spanish translations
const esTranslations = {
  common: {
    loading: "Cargando...",
    remove: "Eliminar",
    cancel: "Cancelar"
  },
  home: {
    title: "Creador de Ordinales 3D",
    subtitle: "Transforma tus Ordinales 2D en impresionantes modelos 3D y acúñalos en la blockchain BSV"
  },
  wallet: {
    connect: "Conectar Cartera",
    disconnect: "Desconectar",
    connected: "Cartera Conectada",
    connected_description: "Tu cartera ha sido conectada con éxito.",
    disconnected: "Cartera Desconectada",
    disconnected_description: "Tu cartera ha sido desconectada.",
    not_installed: {
      title: "Cartera No Instalada",
      description: "La extensión Yours Wallet no está instalada. Por favor, instálala para continuar.",
      message: "La extensión Yours Wallet no está instalada en tu navegador.",
      install: "Instalar Yours Wallet"
    },
    visit_website: "Visitar Sitio Web",
    error: {
      title: "Error de Conexión",
      description: "No se pudo conectar a la cartera. Por favor, inténtalo de nuevo.",
      disconnect_title: "Error al Desconectar",
      disconnect_description: "No se pudo desconectar la cartera. Por favor, inténtalo de nuevo."
    },
    modal: {
      title: "Conecta tu Cartera",
      connect_yours: "Conectar a tu Cartera Yours",
      more_wallets: "Más Carteras Próximamente",
      coming_soon: "Soporte para carteras adicionales planificado"
    }
  },
  progress: {
    title: "Proceso de Acuñación",
    network: "Red",
    mainnet: "Principal",
    steps: {
      connect: "Conectar",
      upload: "Subir",
      preview: "Vista Previa",
      mint: "Acuñar"
    }
  },
  upload: {
    title: "Sube tu Ordinal",
    description: "Selecciona un Ordinal existente de tu cartera para transformarlo en un modelo 3D. Solo se admiten Ordinales de colecciones verificadas.",
    drag_drop: "Arrastra y suelta tu Ordinal, o explora desde tu cartera",
    connect_wallet_first: "Por favor, conecta tu cartera para subir un Ordinal",
    supported_formats: "Formatos soportados: JPG, PNG, GIF, SVG",
    continue: "Continuar a Vista Previa",
    error: {
      invalid_type: {
        title: "Tipo de Archivo Inválido",
        description: "Por favor, sube un archivo de imagen (JPG, PNG, GIF, SVG)."
      },
      validation: {
        title: "Validación Fallida",
        description: "Este Ordinal no pudo ser validado. Asegúrate de que pertenece a una colección soportada."
      },
      upload: {
        title: "Carga Fallida",
        description: "Hubo un error al subir tu Ordinal. Por favor, inténtalo de nuevo."
      }
    }
  },
  collection: {
    title: "Información de la Colección",
    connect_wallet: "Conecta tu Cartera",
    view_eligible: "Para ver tus colecciones elegibles",
    view_stats: "Ver estadísticas de la colección abajo",
    stats: "Estadísticas de la Colección",
    max_supply: "Suministro Máximo",
    minted: "Acuñados",
    "3d_minted": "Acuñados en 3D",
    mint_fee: "Tarifa de Acuñación"
  },
  viewer: {
    title: "Vista Previa 3D",
    connect_and_upload: "Conecta la cartera y sube un Ordinal para generar una vista previa 3D"
  },
  mint: {
    title: "Acuña tu Ordinal 3D",
    generation_fee: "Tarifa de Generación",
    network_fee: "Tarifa de Red",
    total: "Total",
    button: "Acuñar Ordinal 3D",
    processing: "Procesando...",
    terms_agreement: "Al acuñar, aceptas nuestros",
    terms_link: "Términos de Servicio",
    success: {
      title: "Acuñación Exitosa",
      description: "Tu Ordinal 3D ha sido acuñado con éxito."
    },
    error: {
      title: "Acuñación Fallida",
      description: "Hubo un error al acuñar tu Ordinal 3D. Por favor, inténtalo de nuevo."
    },
    status: {
      in_progress: "Acuñación en Progreso",
      in_progress_description: "Tu Ordinal 3D está siendo generado e inscrito en la blockchain BSV.",
      success: "¡Acuñación Exitosa!",
      success_description: "Tu Ordinal 3D ha sido acuñado con éxito en la blockchain BSV.",
      error: "Acuñación Fallida",
      error_description: "Hubo un error al acuñar tu Ordinal 3D. Por favor, inténtalo de nuevo.",
      error_reason: "Error: Fondos insuficientes para completar la transacción"
    },
    tx_id: "ID de Transacción",
    tx_copy: "Copiar",
    tx_view: "Ver en Explorador",
    tx_copied: "ID de Transacción Copiado",
    tx_copied_description: "El ID de transacción ha sido copiado al portapapeles.",
    mint_another: "Acuñar Otro Ordinal",
    try_again: "Intentar de Nuevo"
  },
  examples: {
    title: "Ejemplos de Ordinales 3D",
    minted: "Acuñado en 3D",
    ago: "atrás",
    ordinal_id: "ID de Ordinal",
    view: "Ver",
    time: {
      day: "1 día",
      days: "{{count}} días",
      weeks: "{{count}} semanas",
      months: "{{count}} meses"
    }
  },
  footer: {
    terms: "Términos",
    privacy: "Privacidad",
    contact: "Contacto",
    rights: "Todos los derechos reservados."
  }
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations }
    },
    lng: navigator.language.split('-')[0] || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

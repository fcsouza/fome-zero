// Regex to extract filename from Content-Disposition header
const FILENAME_REGEX = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

export interface FoodAnalysisResult {
  proprio_para_doacao: boolean;
  tipo_alimento: string;
  criterios: {
    dentro_validade: string;
    conservacao_adequada: boolean;
    integridade_preservada: boolean;
    embalagem_integra: string;
    seguranca_sanitaria: boolean;
    propriedades_nutricionais_mantidas: boolean;
  };
  observacoes: string;
  recomendacao: string;
  justificativa: string;
}

export interface Donation {
  id: string;
  doadorId: string;
  status: string;
  tipoAlimento: string;
  descricao?: string | null;
  quantidade?: string | null;
  temperatura?: string | null;
  prazoConsumo?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  analysis?: {
    aiResponse: FoodAnalysisResult;
  };
  certificate?: {
    certificateNumber: string;
  };
}

export interface CreateDonationData {
  tipoAlimento: string;
  descricao?: string;
  quantidade?: string;
  temperatura?: string;
  prazoConsumo?: string;
  imageData?: string;
  textInput?: string;
  aiResponse?: FoodAnalysisResult;
}

export interface ChecklistData {
  checklistType: string;
  responses: Record<string, unknown>;
}

export const donationsApi = {
  async analyzeFood(image: string, text?: string): Promise<FoodAnalysisResult> {
    const response = await fetch('/api/donations/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ image, text }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze food');
    }

    return response.json();
  },

  async createDonation(data: CreateDonationData): Promise<Donation> {
    const response = await fetch('/api/donations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create donation');
    }

    return response.json();
  },

  async getDonations(filters?: { status?: string }): Promise<Donation[]> {
    const params = new URLSearchParams();
    if (filters?.status) {
      params.append('status', filters.status);
    }

    const response = await fetch(`/api/donations?${params.toString()}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get donations');
    }

    return response.json();
  },

  async getDonation(id: string): Promise<Donation> {
    const response = await fetch(`/api/donations/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get donation');
    }

    return response.json();
  },

  async submitChecklist(
    donationId: string,
    data: ChecklistData
  ): Promise<unknown> {
    const response = await fetch(`/api/donations/${donationId}/checklist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit checklist');
    }

    return response.json();
  },

  async generateCertificate(donationId: string): Promise<unknown> {
    const response = await fetch(`/api/donations/${donationId}/certificate`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate certificate');
    }

    return response.json();
  },

  async downloadCertificate(donationId: string): Promise<void> {
    const response = await fetch(`/api/donations/${donationId}/certificate`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to download certificate' }));
      throw new Error(error.message || 'Failed to download certificate');
    }

    // Extract filename from Content-Disposition header if available
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `certificado-${donationId}.pdf`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(FILENAME_REGEX);
      if (filenameMatch?.[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  async acceptDonation(donationId: string): Promise<unknown> {
    const response = await fetch(`/api/donations/${donationId}/accept`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to accept donation');
    }

    return response.json();
  },

  async collectDonation(donationId: string): Promise<unknown> {
    const response = await fetch(`/api/donations/${donationId}/collect`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to collect donation');
    }

    return response.json();
  },
};


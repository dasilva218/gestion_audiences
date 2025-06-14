import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "./useAuth";


const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  telephone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>;

export default function useRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const { signUp } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver:zodResolver( registerSchema ),
    defaultValues:{
      email: '',
      password: '',
      confirmPassword: '',
      nom: '',
      prenom: '',
      telephone: '',
    }
  })

  const onSubmit = async (data:RegisterFormData) => {
    
    setIsLoading(true);

    const { error } = await signUp(data.email, data.password, {
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
    });

    if (error) {
      console.log(error);
      
      toast("Erreur d'inscription");
    } else {
      toast("Inscription réussie");
      router.push("/login");
    }

    setIsLoading(false);
  };

  return {
    form,
    isLoading,
    onSubmit,
  };
}
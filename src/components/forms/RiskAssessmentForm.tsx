"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Heart,
  Activity,
  Wine,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Shield,
} from "lucide-react";
import { riskFormSchema, type RiskFormValues } from "@/lib/schema";
import { MUNICIPIOS_FRECUENTES } from "@/lib/utils-medical";
import { NIVEL_ESTUDIOS_OPTIONS, ALCOHOL_OPTIONS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { FormPayload } from "@/types";

interface RiskAssessmentFormProps {
  onSubmit: (payload: FormPayload) => Promise<void>;
  isLoading: boolean;
}

const SectionCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-white/8 bg-card p-5 space-y-4">
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/15">
        <Icon className="w-4 h-4 text-blue-400" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

export function RiskAssessmentForm({ onSubmit, isLoading }: RiskAssessmentFormProps) {
  const [peso, setPeso] = useState<string>("");
  const [altura, setAltura] = useState<string>("");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<RiskFormValues>({
    resolver: zodResolver(riskFormSchema),
    defaultValues: {
      SEXOa: 0 as unknown as number,
      EDADa: 40,
      NIVEST: "",
      T112: 0 as unknown as number,
      T113: 0,
      V121: 0 as unknown as number,
      W127: "",
      IMCa: 0 as unknown as number,
      CODIGO_INE: "",
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  const calcIMC = (p: string, a: string) => {
    const pesoN = parseFloat(p);
    const altN = parseFloat(a) / 100;
    if (!pesoN || !altN || altN <= 0) return;
    const imc = pesoN / (altN * altN);
    if (imc < 18.5) setValue("IMCa", 1, { shouldValidate: true });
    else if (imc < 25) setValue("IMCa", 2, { shouldValidate: true });
    else if (imc < 30) setValue("IMCa", 3, { shouldValidate: true });
    else setValue("IMCa", 4, { shouldValidate: true });
  };

  const handleFormSubmit = (data: RiskFormValues) => {
    onSubmit(data as FormPayload);
  };

  const ToggleBtn = ({
    selected,
    onClick,
    children,
    className,
  }: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer",
        selected
          ? "border-blue-500 bg-blue-500/15 text-blue-300"
          : "border-white/10 bg-white/3 text-slate-400 hover:border-white/20 hover:bg-white/5",
        className
      )}
    >
      {children}
    </button>
  );

  const IMC_CARDS = [
    { value: 1, label: "Bajo peso", range: "< 18.5", color: "text-blue-400" },
    { value: 2, label: "Normal", range: "18.5–24.9", color: "text-green-400" },
    { value: 3, label: "Sobrepeso", range: "25–29.9", color: "text-yellow-400" },
    { value: 4, label: "Obesidad", range: "≥ 30", color: "text-red-400" },
  ];

  const TABAQUISMO = [
    { value: 1, label: "No fumador", icon: CheckCircle, color: "text-green-400" },
    { value: 2, label: "Exfumador", icon: Clock, color: "text-slate-400" },
    { value: 3, label: "Ocasional", icon: AlertCircle, color: "text-orange-400" },
    { value: 4, label: "Habitual", icon: XCircle, color: "text-red-400" },
  ];

  const ACTIVIDAD = [
    { value: 1, label: "Sedentario", emoji: "🛋️" },
    { value: 2, label: "Ligera", emoji: "🚶" },
    { value: 3, label: "Moderada", emoji: "🏃" },
    { value: 4, label: "Intensa", emoji: "🏋️" },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* SECCIÓN 1 — Datos Demográficos */}
      <SectionCard icon={User} title="Datos Demográficos">
        {/* Sexo */}
        <div>
          <Label className="text-slate-300 mb-2 block">Sexo biológico</Label>
          <Controller
            name="SEXOa"
            control={control}
            render={({ field }) => (
              <div className="flex gap-3">
                <ToggleBtn
                  selected={field.value === 1}
                  onClick={() => field.onChange(1)}
                >
                  <span className="text-2xl">♂</span>
                  <span className="text-sm font-medium">Hombre</span>
                </ToggleBtn>
                <ToggleBtn
                  selected={field.value === 2}
                  onClick={() => field.onChange(2)}
                >
                  <span className="text-2xl">♀</span>
                  <span className="text-sm font-medium">Mujer</span>
                </ToggleBtn>
              </div>
            )}
          />
          {errors.SEXOa && (
            <p className="text-red-400 text-xs mt-1">{errors.SEXOa.message}</p>
          )}
        </div>

        {/* Edad */}
        <div>
          <Label className="text-slate-300 mb-2 block">
            Edad:{" "}
            <span className="font-bold text-blue-400">{watchedValues.EDADa} años</span>
          </Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Controller
                name="EDADa"
                control={control}
                render={({ field }) => (
                  <Slider
                    min={15}
                    max={69}
                    step={1}
                    value={[field.value]}
                    onValueChange={(val) => {
                      const v = Array.isArray(val) ? val[0] : val;
                      field.onChange(v);
                    }}
                    className="w-full"
                  />
                )}
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>15</span>
                <span>69</span>
              </div>
            </div>
            <Controller
              name="EDADa"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  min={15}
                  max={69}
                  value={field.value}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 15)}
                  className="w-20 text-center bg-white/5 border-white/10 text-white"
                />
              )}
            />
          </div>
        </div>

        {/* Código INE */}
        <div>
          <Label className="text-slate-300 mb-2 block">Código INE del municipio</Label>
          <Controller
            name="CODIGO_INE"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                maxLength={5}
                placeholder="p. ej. 28079"
                pattern="[0-9]*"
                inputMode="numeric"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600"
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  field.onChange(val);
                }}
              />
            )}
          />
          {errors.CODIGO_INE && (
            <p className="text-red-400 text-xs mt-1">{errors.CODIGO_INE.message}</p>
          )}

          {/* Municipios rápidos */}
          <div className="mt-2">
            <p className="text-xs text-slate-500 mb-1.5">Municipios frecuentes:</p>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
              {MUNICIPIOS_FRECUENTES.map((m) => (
                <button
                  key={m.codigo}
                  type="button"
                  onClick={() =>
                    setValue("CODIGO_INE", m.codigo, { shouldValidate: true })
                  }
                  className={cn(
                    "text-[11px] px-2 py-0.5 rounded-full border transition-all",
                    watchedValues.CODIGO_INE === m.codigo
                      ? "border-blue-500 bg-blue-500/20 text-blue-300"
                      : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                  )}
                >
                  {m.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* SECCIÓN 2 — Perfil de Salud */}
      <SectionCard icon={Heart} title="Perfil de Salud">
        {/* Nivel de estudios */}
        <div>
          <Label className="text-slate-300 mb-2 block">Nivel de estudios</Label>
          <Controller
            name="NIVEST"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Selecciona el nivel de estudios" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F1629] border-white/10">
                  {NIVEL_ESTUDIOS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-slate-300 focus:bg-blue-500/20 focus:text-blue-300">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.NIVEST && (
            <p className="text-red-400 text-xs mt-1">{errors.NIVEST.message}</p>
          )}
        </div>

        {/* IMC */}
        <div>
          <Label className="text-slate-300 mb-2 block">
            Índice de Masa Corporal (IMC)
          </Label>
          {/* Calculadora automática */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Peso (kg)"
                value={peso}
                onChange={(e) => {
                  setPeso(e.target.value);
                  calcIMC(e.target.value, altura);
                }}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 text-sm"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Altura (cm)"
                value={altura}
                onChange={(e) => {
                  setAltura(e.target.value);
                  calcIMC(peso, e.target.value);
                }}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 text-sm"
              />
            </div>
          </div>
          <Controller
            name="IMCa"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {IMC_CARDS.map((card) => (
                  <button
                    key={card.value}
                    type="button"
                    onClick={() => field.onChange(card.value)}
                    className={cn(
                      "flex flex-col items-center p-3 rounded-xl border-2 transition-all",
                      field.value === card.value
                        ? "border-blue-500 bg-blue-500/15"
                        : "border-white/8 bg-white/3 hover:border-white/15"
                    )}
                  >
                    <span className={cn("text-sm font-semibold", card.color)}>
                      {card.label}
                    </span>
                    <span className="text-[11px] text-slate-500">{card.range}</span>
                  </button>
                ))}
              </div>
            )}
          />
          {errors.IMCa && (
            <p className="text-red-400 text-xs mt-1">{errors.IMCa.message}</p>
          )}
        </div>
      </SectionCard>

      {/* SECCIÓN 3 — Hábitos de Vida */}
      <SectionCard icon={Activity} title="Hábitos de Vida">
        {/* Tabaquismo */}
        <div>
          <Label className="text-slate-300 mb-2 block">Hábito tabáquico</Label>
          <Controller
            name="T112"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {TABAQUISMO.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => field.onChange(t.value)}
                      className={cn(
                        "flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-left",
                        field.value === t.value
                          ? "border-blue-500 bg-blue-500/15 text-blue-300"
                          : "border-white/8 bg-white/3 hover:border-white/15 text-slate-400"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 shrink-0", t.color)} />
                      <span className="text-xs font-medium">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.T112 && (
            <p className="text-red-400 text-xs mt-1">{errors.T112.message}</p>
          )}
        </div>

        {/* Exposición pasiva */}
        <div>
          <Label className="text-slate-300 mb-2 block">
            Exposición pasiva al humo:{" "}
            <span
              className={cn(
                "font-bold",
                watchedValues.T113 >= 4 ? "text-red-400" : "text-green-400"
              )}
            >
              {watchedValues.T113} h/día
            </span>
          </Label>
          <Controller
            name="T113"
            control={control}
            render={({ field }) => (
              <Slider
                min={0}
                max={7}
                step={1}
                value={[field.value]}
                onValueChange={(val) => {
                  const v = Array.isArray(val) ? val[0] : val;
                  field.onChange(v);
                }}
              />
            )}
          />
          <div className="flex justify-between text-[11px] mt-1">
            <span className="text-green-500">Sin exposición</span>
            <span className="text-red-500">Exposición alta</span>
          </div>
        </div>

        {/* Actividad física */}
        <div>
          <Label className="text-slate-300 mb-2 block">Actividad física habitual</Label>
          <Controller
            name="V121"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {ACTIVIDAD.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => field.onChange(a.value)}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all",
                      field.value === a.value
                        ? "border-blue-500 bg-blue-500/15 text-blue-300"
                        : "border-white/8 bg-white/3 hover:border-white/15 text-slate-400"
                    )}
                  >
                    <span>{a.emoji}</span>
                    <span className="text-xs font-medium">{a.label}</span>
                  </button>
                ))}
              </div>
            )}
          />
          {errors.V121 && (
            <p className="text-red-400 text-xs mt-1">{errors.V121.message}</p>
          )}
        </div>
      </SectionCard>

      {/* SECCIÓN 4 — Consumo de Alcohol */}
      <SectionCard icon={Wine} title="Consumo de Alcohol">
        <div>
          <Label className="text-slate-300 mb-2 block">Frecuencia de consumo</Label>
          <Controller
            name="W127"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Selecciona la frecuencia" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F1629] border-white/10">
                  {ALCOHOL_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-slate-300 focus:bg-blue-500/20 focus:text-blue-300">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.W127 && (
            <p className="text-red-400 text-xs mt-1">{errors.W127.message}</p>
          )}
        </div>
      </SectionCard>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isLoading || !isValid}
        className={cn(
          "w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-200",
          "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25",
          "hover:from-blue-500 hover:to-cyan-400 hover:shadow-blue-500/40",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        )}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Analizando perfil...</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            <span>Calcular Riesgo Cardio-Respiratorio</span>
          </>
        )}
      </button>

      <div className="flex items-center gap-2 justify-center">
        <Shield className="w-3.5 h-3.5 text-slate-500" />
        <p className="text-[11px] text-slate-500 text-center">
          Los datos se procesan localmente en la red (192.168.0.92) y nunca salen a internet.
        </p>
      </div>
    </form>
  );
}

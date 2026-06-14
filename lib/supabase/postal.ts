import "server-only";

import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type PostalOrderUpdate = {
  status?: string;
  kapsule_id?: string | null;
  expedited_at?: string | null;
  tracking_number?: string | null;
  carrier?: string | null;
  updated_at?: string;
};

export type PostalDatabase = {
  public: {
    Tables: {
      postal_orders: {
        Row: {
          id: string;
          client_email: string;
          event_type: string;
          event_date: string | null;
          base_template_id: string | null;
          template: Json | null;
          status: string;
          stripe_session_id: string | null;
          paid_at: string | null;
          submitted_at: string | null;
          kapsule_id: string | null;
          expedited_at: string | null;
          shipping_address: Json | null;
          tracking_number: string | null;
          carrier: string | null;
          refunded_at: string | null;
          return_share_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: PostalOrderUpdate & { client_email: string; event_type: string };
        Update: PostalOrderUpdate;
        Relationships: [];
      };
      kapsules: {
        Row: {
          id: string;
          seq: number;
          token_hash: string;
          app_version: string | null;
          last_seen_at: string | null;
          enrolled_at: string;
          revoked_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: { id: string; token_hash: string };
        Update: {
          app_version?: string | null;
          last_seen_at?: string | null;
          revoked_at?: string | null;
        };
        Relationships: [];
      };
      order_events: {
        Row: {
          id: string;
          order_id: string;
          event_type: string;
          actor: Json;
          payload: Json | null;
          created_at: string;
        };
        Insert: {
          order_id: string;
          event_type: string;
          actor: Json;
          payload?: Json | null;
        };
        Update: { payload?: Json | null };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export function createPostalClient() {
  return createClient<PostalDatabase>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

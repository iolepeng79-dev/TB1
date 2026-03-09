import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useAnalytics = () => {
  const trackEvent = async (eventType: string, businessId?: string, metadata?: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('analytics_events').insert({
        event_type: eventType,
        business_id: businessId,
        user_id: user?.id,
        metadata
      });
    } catch (err) {
      console.error('Failed to track analytics event:', err);
    }
  };

  const getBusinessAnalytics = async (businessId: string) => {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('business_id', businessId);
    
    if (error) throw error;
    return data;
  };

  return { trackEvent, getBusinessAnalytics };
};

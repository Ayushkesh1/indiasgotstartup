import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, text } = await req.json();
    
    // Validate input
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required and must be a string' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Text must be less than 5000 characters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    if (!['refine', 'expand', 'shorten'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Must be refine, expand, or shorten' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "refine") {
      systemPrompt = "You are a professional bio writer. Help users create compelling, authentic professional bios that showcase their unique value. Keep it concise, engaging, and genuine.";
      userPrompt = `Please refine and improve this bio, making it more professional and engaging while maintaining authenticity:\n\n${text}`;
    } else if (action === "expand") {
      systemPrompt = "You are a creative writer who helps expand brief descriptions into engaging, detailed bios that capture personality and professionalism.";
      userPrompt = `Please expand this brief description into a full professional bio (2-3 sentences):\n\n${text}`;
    } else if (action === "shorten") {
      systemPrompt = "You are an expert at distilling information. Help users create concise, impactful bios that capture their essence.";
      userPrompt = `Please make this bio more concise while keeping the key points:\n\n${text}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const refinedText = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ text: refinedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in profile-assistant:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

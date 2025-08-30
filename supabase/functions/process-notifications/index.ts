import { createClient } from 'npm:@supabase/supabase-js@2.56.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface EmailJSPayload {
  service_id: string;
  template_id: string;
  user_id: string;
  template_params: {
    to_email: string;
    student_name: string;
    subject: string;
    message: string;
  };
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log("Processing pending notifications...");
    
    // Get pending notifications
    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .limit(50); // Process in batches

    if (notificationsError) {
      console.error("Error fetching notifications:", notificationsError);
      throw notificationsError;
    }

    console.log(`Found ${notifications?.length || 0} pending notifications`);

    if (!notifications || notifications.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending notifications to process" }),
        { 
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          } 
        }
      );
    }

    let successCount = 0;
    let failCount = 0;

    for (const notification of notifications) {
      try {
        // Prepare EmailJS payload
        const emailPayload: EmailJSPayload = {
          service_id: "service_your_service_id", // This should be configured in environment
          template_id: "template_your_template_id", // This should be configured in environment
          user_id: "your_emailjs_public_key", // This should be configured in environment
          template_params: {
            to_email: notification.email,
            student_name: "Student", // We could enhance this by joining with profiles
            subject: notification.subject,
            message: notification.message
          }
        };

        // Send email via EmailJS API
        const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailPayload)
        });

        if (emailResponse.ok) {
          // Update notification status to sent
          await supabase
            .from('notifications')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString()
            })
            .eq('id', notification.id);
          
          successCount++;
          console.log(`Notification sent successfully to ${notification.email}`);
        } else {
          const errorText = await emailResponse.text();
          console.error(`Failed to send notification to ${notification.email}:`, errorText);
          
          // Update notification status to failed
          await supabase
            .from('notifications')
            .update({
              status: 'failed',
              error_message: errorText
            })
            .eq('id', notification.id);
          
          failCount++;
        }
      } catch (error) {
        console.error(`Error processing notification ${notification.id}:`, error);
        
        // Update notification status to failed
        await supabase
          .from('notifications')
          .update({
            status: 'failed',
            error_message: error.message
          })
          .eq('id', notification.id);
        
        failCount++;
      }
    }

    console.log(`Processed notifications: ${successCount} successful, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        message: `Processed ${notifications.length} notifications`,
        successful: successCount,
        failed: failCount
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        }
      }
    );

  } catch (error: any) {
    console.error("Error in process-notifications function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        }
      }
    );
  }
});
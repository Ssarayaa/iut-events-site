package iut.events.site.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
// Configuration web : rend accessibles les images sauvegardees dans le dossier uploads.
public class WebConfig implements WebMvcConfigurer {

    @Override
    // Associe les URLs /uploads/... aux fichiers physiques du dossier uploads/.
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}

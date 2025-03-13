export function NavSkeleton() {
  return (
    <div className="space-y-6 py-4 px-2">
      {/* First Group */}
      <div className="space-y-4">
        {/* Group Title */}
        <div className="h-5 bg-muted/60 rounded w-1/2 animate-pulse" />
        
        {/* Modules */}
        <div className="space-y-3 pl-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              {/* Module Title with Icon */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-muted/60 rounded animate-pulse" />
                <div className="h-4 bg-muted/60 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second Group */}
      <div className="space-y-4">
        {/* Group Title */}
        <div className="h-5 bg-muted/60 rounded w-2/3 animate-pulse" />
        
        {/* Modules */}
        <div className="space-y-3 pl-2">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              {/* Module Title with Icon */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-muted/60 rounded animate-pulse" />
                <div className="h-4 bg-muted/60 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Third Group */}
      <div className="space-y-4">
        {/* Group Title */}
        <div className="h-5 bg-muted/60 rounded w-1/2 animate-pulse" />
        
        {/* Modules */}
        <div className="space-y-3 pl-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              {/* Module Title with Icon */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-muted/60 rounded animate-pulse" />
                <div className="h-4 bg-muted/60 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fourth Group */}
      <div className="space-y-4">
        {/* Group Title */}
        <div className="h-5 bg-muted/60 rounded w-1/2 animate-pulse" />
        
        {/* Modules */}
        <div className="space-y-3 pl-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              {/* Module Title with Icon */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-muted/60 rounded animate-pulse" />
                <div className="h-4 bg-muted/60 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
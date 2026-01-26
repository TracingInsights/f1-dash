use std::{fs::File, path::Path};

use anyhow::Error;

pub async fn save(path: &Path) -> Result<(), Error> {
    if path.exists() {
        return Err(anyhow::anyhow!(
            "File already exists at path {}",
            path.display()
        ));
    }

    let file = match File::create(path) {
        Ok(file) => file,
        Err(e) => {
            return Err(anyhow::anyhow!(
                "Failed to create file at path {}: {}",
                path.display(),
                e
            ));
        }
    };

    todo!("not implemented yet");

    // let mut writer = LineWriter::new(file);

    // Ok(())
}
